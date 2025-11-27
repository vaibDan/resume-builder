ImageKit configuration and troubleshooting
======================================

If your uploads are being saved into MongoDB as a BASE64 data URI (e.g. "data:image/png;base64,...") instead of being uploaded to ImageKit, check these points first:

- Ensure the ImageKit environment variables are set in your server .env file:

  - IMAGEKIT_PUBLIC_KEY
  - IMAGEKIT_PRIVATE_KEY
  - IMAGEKIT_URL_ENDPOINT

- Do not include unmatched quotes in the values. For example, this is malformed and will break ImageKit initialization:

  IMAGEKIT_PUBLIC_KEY="public_AbCdEfG==

  Instead, use:

  IMAGEKIT_PUBLIC_KEY=public_AbCdEfG==

- After fixing the environment variables, restart the server so the new values are loaded.

- The update resume flow attempts to upload a base64 data URI to ImageKit. If the upload fails, the server now returns an explicit 500 error so the base64 data is not silently stored in the DB.

If you continue to have issues, check your server logs for warnings printed at startup (missing env vars) and for upload error messages logged when the upload attempt occurs.
