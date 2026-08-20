"""Custom exceptions for SUNU BANK API."""


class SunuBankException(Exception):
    """Base exception for all SUNU BANK errors."""

    pass


class AuthenticationError(SunuBankException):
    """Raised when authentication fails."""

    pass


class AuthorizationError(SunuBankException):
    """Raised when user lacks required permissions."""

    pass


class NotFoundError(SunuBankException):
    """Raised when resource is not found."""

    pass


class ValidationError(SunuBankException):
    """Raised when validation fails."""

    pass


class DataProcessingError(SunuBankException):
    """Raised when data processing fails."""

    pass


class ModelError(SunuBankException):
    """Raised when model prediction fails."""

    pass


class DatabaseError(SunuBankException):
    """Raised when database operation fails."""

    pass
