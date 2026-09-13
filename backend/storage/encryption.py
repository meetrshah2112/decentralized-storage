import hashlib
import os

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from django.conf import settings


NONCE_SIZE = 12
KEY_SIZE = 32


def get_master_key():
    """
    Creates a stable 256-bit master key from Django SECRET_KEY.

    This master key is used only to protect individual file keys.
    """

    secret = settings.SECRET_KEY.encode("utf-8")

    return hashlib.sha256(secret).digest()


def encrypt_file(file_data):
    """
    Encrypt a file using AES-256-GCM.

    Returns:
        encrypted_data
        file_key
        file_nonce
    """

    # Generate a unique 256-bit key for this file
    file_key = AESGCM.generate_key(bit_length=256)

    # Generate a unique 96-bit nonce
    file_nonce = os.urandom(NONCE_SIZE)

    aes = AESGCM(file_key)

    encrypted_data = aes.encrypt(
        file_nonce,
        file_data,
        None,
    )

    return (
        encrypted_data,
        file_key,
        file_nonce,
    )


def protect_file_key(file_key):
    """
    Encrypt the per-file AES key using the application's
    master key.

    The master key itself is never stored in the database.
    """

    master_key = get_master_key()

    key_nonce = os.urandom(NONCE_SIZE)

    aes = AESGCM(master_key)

    encrypted_key = aes.encrypt(
        key_nonce,
        file_key,
        None,
    )

    return (
        encrypted_key,
        key_nonce,
    )


def recover_file_key(encrypted_key, key_nonce):
    """
    Recover the original file encryption key.
    """

    master_key = get_master_key()

    aes = AESGCM(master_key)

    return aes.decrypt(
        key_nonce,
        encrypted_key,
        None,
    )


def decrypt_file(
    encrypted_data,
    encrypted_key,
    key_nonce,
    file_nonce,
):
    """
    Decrypt an encrypted file using AES-256-GCM.
    """

    file_key = recover_file_key(
        encrypted_key,
        key_nonce,
    )

    aes = AESGCM(file_key)

    return aes.decrypt(
        file_nonce,
        encrypted_data,
        None,
    )