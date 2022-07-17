import common.api_config as Cnf
from api.models import Student
from rest_framework import generics
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.serializers import StudentSerializer, UserSerializer, RegisterSerializer


class HealthView(APIView):
    '''
    This view provides a get call to know whether the backend is responding or not
    '''
    permission_classes = (IsAuthenticated, )
  
    def get(self, request, format=None):
        res = Cnf.prepareSuccessResponse('Running fine!')
        return res


class UserView(APIView):
    '''
    Send back the user details
    '''
    permission_classes = (IsAuthenticated, )
  
    def get(self, request):        
        try:
            user = User.objects.get(id=request.user.id)
            userInfo = {
                'uname': user.username,
                'email': user.email,
                'fname': user.first_name,
                'lname': user.last_name,
                'admin': user.is_superuser,
                'id': user.id,
            }
            res = Cnf.prepareSuccessResponse(userInfo)
            return res
        except Exception as e:
            return Cnf.prepareErrorResponse('default')


class RegisterUserView(generics.CreateAPIView):
    '''
    Creates user instance in User model
    '''
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class StudentListView(APIView):
    '''
    This view provides a get & post calls to fetch all Student objects and creat new instance respectively
    '''
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        try:
            students = Student.objects.all()
            serializedData = StudentSerializer(students, many=True)
            res = Cnf.prepareSuccessResponse(serializedData.data)
            return res
        except Exception as e:
            print(f"[ERROR]: {e}")
            return Cnf.prepareErrorResponse('dberr_get')
        
    
    def post(self, request):
        try:
            serializedData = StudentSerializer(data=request.data)
            res = None
            if serializedData.is_valid():
                serializedData.save()
                res = Cnf.prepareSuccessResponse(serializedData.data, 201)
            else:
                res = Cnf.prepareErrorResponse('dberr_post', 500, "Invalid input for the fields!")
            return res
        except Exception as e:
            print(f"[ERROR]: {e}")
            return Cnf.prepareErrorResponse('dberr_post')


class StudentDetailView(APIView):
    '''
    This view provides get, put & del calls, to fetch, update & remove instances respectively 
    '''
    permission_classes = (IsAuthenticated, )

    def fetchRecordBasedOnId(self, id):
        try:
            return Student.objects.get(user=id)
        except Exception as e:
            print(f"[ERROR]: {e}")
            raise Exception(str(e))

    
    def get(self, request, id):
        try:
            student = self.fetchRecordBasedOnId(id)
            res = None
            if (student):
                serializedData = StudentSerializer(student)
                res = Cnf.prepareSuccessResponse(serializedData.data)
            else:
                res = Cnf.prepareErrorResponse('dberr_get', 400)
            return res
        except Exception as e:
            print(f"[ERROR]: {e}")
            return Cnf.prepareErrorResponse('dberr_get', 400, str(e))


    def put(self, request, id):
        try:
            student = self.fetchRecordBasedOnId(id)
            serializedData = StudentSerializer(student, data=request.data)
            res = None
            if serializedData.is_valid():
                serializedData.save()
                res = Cnf.prepareSuccessResponse(serializedData.data, 200)
            else:
                res = Cnf.prepareErrorResponse('dberr_put', 500)
            return res
        except Exception as e:
            print(f"[ERROR]: {e}")
            return Cnf.prepareErrorResponse('dberr_put', 400, str(e))


    def delete(self, request, id):
        try:
            student = self.fetchRecordBasedOnId(id)
            res = None
            if (student):
                serializedData = StudentSerializer(student)
                student.delete()
                res = Cnf.prepareSuccessResponse(serializedData.data, 204)
            else:
                res = Cnf.prepareErrorResponse('dberr_del', 500)
            return res
        except Exception as e:
            print(f"[ERROR]: {e}")
            return Cnf.prepareErrorResponse('dberr_del', 400, str(e))
