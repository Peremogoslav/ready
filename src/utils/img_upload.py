import requests
import base64

IMGBB_API_KEY = "d4d6c58e63d037d9c2af5e11cb51db2e"


def upload_image_to_imgbb(image_bytes: bytes) -> str:
    if not image_bytes:
        raise Exception("Empty image bytes provided")

    encoded_image = base64.b64encode(image_bytes).decode('utf-8')

    payload = {
        "key": IMGBB_API_KEY,
        "image": encoded_image,
    }
    response = requests.post("https://api.imgbb.com/1/upload", data=payload)
    if response.status_code == 200:
        json_response = response.json()
        return json_response["data"]["url"]
    else:
        raise Exception(f"Failed to upload image to imgbb: {response.text}")
