from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO
import numpy as np
import tensorflow as tf
import os
from google.cloud import storage
from tensorflow.keras.models import load_model

# --- GLOBAL MODEL LOADING ---
# --- DYNAMIC MODEL PATH ---
# The model is in the 'models' directory, relative to the current script.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, '..', 'models', 'plant_disease_prediction_model.h5')

# Initialize model variable
model = None

try:
    # Load the model only once when the application starts
    model = load_model(MODEL_PATH)

    # Simple prediction to initialize the model and avoid latency on first request
    # NOTE: The input size (224, 224, 3) must match your model's input layer shape.
    model.predict(np.zeros((1, 224, 224, 3)))
    print("✅ Model loaded successfully!")

except Exception as e:
    print(f"❌ Error loading model: {e}")
    # If loading fails, the API will be disabled gracefully.

# ----------------------------

app = FastAPI()

# --- CORS CONFIGURATION ---
# Allows communication with the frontend running in your browser, even if opened
# directly via file:/// or running on a different port.
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --------------------------

@app.post("/predict_image/")
async def predict_image(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model service is currently unavailable.")

    # 1. Read the file content
    content = await file.read()

    # 2. Preprocess the Image for the Model
    TARGET_SIZE = (224, 224)

    try:
        image = Image.open(BytesIO(content)).resize(TARGET_SIZE).convert('RGB')
        img_array = np.array(image)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0  # Normalize pixel values

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image preprocessing failed: {str(e)}")

    # 3. Get Prediction
    try:
        predictions = model.predict(img_array)

        # Process predictions
        predicted_class_index = np.argmax(predictions, axis=1)[0]
        confidence = float(np.max(predictions))

        # --- CLASS NAMES (Verified List) ---
        class_names = ["Apple__Apple_scab", "Apple__Black_rot", "Apple__Cedar_apple_rust",
                       "Apple__healthy", "Corn__Cercospora_leaf_spot", "Corn__Common_rust_",
                       "Corn__healthy", "Grape__Black_rot", "Grape__healthy",
                       "Tomato__Bacterial_spot", "Tomato__healthy"]

        predicted_class = class_names[predicted_class_index]

        # 4. Return Results with the CORRECT STRUCTURE
        # The frontend expects 'model_output' which contains 'prediction'
        return JSONResponse(content={
            "status": "success",
            "filename": file.filename,
            "model_output": { # <--- FIX: This wrapper key is required by your JS
                "prediction": {
                    "class": predicted_class,
                    "confidence": confidence
                }
            }
        })

    except Exception as e:
        # Catch any errors during the prediction phase
        raise HTTPException(status_code=500, detail=f"Model prediction failed: {str(e)}")