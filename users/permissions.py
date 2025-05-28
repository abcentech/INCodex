from rest_framework.permissions import BasePermission

class IsVerified(BasePermission):
    '''
    Checks if the user has been verified (BVN)
    '''
    
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_verified)