
from fastapi import (
    APIRouter,
    HTTPException,
    UploadFile,
    File,
    Depends
)
from pydantic import BaseModel
from database import get_connection
from auth import get_current_user
import os
import uuid
import shutil


router = APIRouter(
    prefix="/profile",
    tags=["Passenger Profile"]
)


# -----------------------------------------
# PROFILE UPDATE MODEL
# -----------------------------------------

class ProfileUpdate(BaseModel):
    full_name: str
    phone: str


# -----------------------------------------
# VERIFY PASSENGER ACCESS
# -----------------------------------------

def verify_passenger_access(user_id: int, current_user: dict):

    if current_user["role"] != "Passenger":
        raise HTTPException(
            status_code=403,
            detail="Only passengers can access this profile."
        )

    if current_user["id"] != user_id:
        raise HTTPException(
            status_code=403,
            detail="You cannot access another user's profile."
        )


# -----------------------------------------
# GET PASSENGER PROFILE
# -----------------------------------------

@router.get("/{user_id}")
def get_profile(
    user_id: int,
    current_user: dict = Depends(get_current_user)
):

    verify_passenger_access(user_id, current_user)

    conn = get_connection()

    try:
        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    u.id,
                    u.full_name,
                    u.email,
                    u.phone,
                    pp.id,
                    pp.profile_photo
                FROM users u
                LEFT JOIN passenger_profiles pp
                    ON pp.user_id = u.id
                WHERE u.id = %s
                """,
                (user_id,)
            )

            profile = cursor.fetchone()

            if not profile:
                raise HTTPException(
                    status_code=404,
                    detail="User profile not found."
                )

            return {
                "id": profile[0],
                "full_name": profile[1],
                "email": profile[2],
                "phone": profile[3],
                "role": "Passenger",
                "passenger_profile_id": profile[4],
                "profile_photo": profile[5]
            }

    finally:
        conn.close()


# -----------------------------------------
# UPDATE PASSENGER PROFILE
# -----------------------------------------

@router.put("/{user_id}")
def update_profile(
    user_id: int,
    data: ProfileUpdate,
    current_user: dict = Depends(get_current_user)
):

    verify_passenger_access(user_id, current_user)

    conn = get_connection()

    try:
        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT id
                FROM users
                WHERE id = %s
                """,
                (user_id,)
            )

            user = cursor.fetchone()

            if not user:
                raise HTTPException(
                    status_code=404,
                    detail="User not found."
                )

            cursor.execute(
                """
                UPDATE users
                SET
                    full_name = %s,
                    phone = %s
                WHERE id = %s
                RETURNING id, full_name, email, phone
                """,
                (
                    data.full_name,
                    data.phone,
                    user_id
                )
            )

            updated = cursor.fetchone()

            if not updated:
                raise HTTPException(
                    status_code=404,
                    detail="Profile could not be updated."
                )

            conn.commit()

            return {
                "message": "Profile updated successfully.",
                "profile": {
                    "id": updated[0],
                    "full_name": updated[1],
                    "email": updated[2],
                    "phone": updated[3],
                    "role": "Passenger"
                }
            }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()

        print("Profile update error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to update profile."
        )

    finally:
        conn.close()


# -----------------------------------------
# UPLOAD PROFILE PHOTO
# -----------------------------------------

@router.post("/{user_id}/photo")
def upload_profile_photo(
    user_id: int,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):

    verify_passenger_access(user_id, current_user)

    conn = get_connection()

    try:

        # CHECK USER EXISTS

        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT id
                FROM users
                WHERE id = %s
                """,
                (user_id,)
            )

            user = cursor.fetchone()

            if not user:
                raise HTTPException(
                    status_code=404,
                    detail="User not found."
                )

        # CHECK IMAGE TYPE

        allowed_types = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp"
        }

        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Only JPG, PNG and WEBP images are allowed."
            )

        # CREATE UPLOAD DIRECTORY

        upload_directory = "uploads"

        os.makedirs(
            upload_directory,
            exist_ok=True
        )

        # CREATE UNIQUE FILE NAME

        extension = allowed_types[file.content_type]
        filename = f"{uuid.uuid4()}{extension}"

        file_path = os.path.join(
            upload_directory,
            filename
        )

        # SAVE IMAGE

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )

        # SAVE PHOTO PATH TO DATABASE

        photo_url = f"/uploads/{filename}"

        with conn.cursor() as cursor:

            cursor.execute(
                """
                UPDATE passenger_profiles
                SET profile_photo = %s
                WHERE user_id = %s
                """,
                (
                    photo_url,
                    user_id
                )
            )

            conn.commit()

        return {
            "message": "Profile photo uploaded successfully.",
            "profile_photo": photo_url
        }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()

        print(
            "Profile photo upload error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to upload profile photo."
        )

    finally:
        conn.close()
        file.file.close()
