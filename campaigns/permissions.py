from rest_framework.permissions import BasePermission

class IsBusiness(BasePermission):
    def has_permission(self, request, view):
        return request.user.user_type == "BUSINESS"
    

class IsCampaignOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.business == request.user