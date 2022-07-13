from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from api.views import HealthView, StudentListView, StudentDetailView, UserView
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView,TokenVerifyView)


urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('health/', HealthView.as_view(), name ='health'),
    path('student/', StudentListView.as_view(), name ='student_info'),
    path('student/<int:id>/', StudentDetailView.as_view(), name ='student_detailed_info'),
    path('user/', UserView.as_view(), name ='user'),
]   

urlpatterns = format_suffix_patterns(urlpatterns)