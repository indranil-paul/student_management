import copy
from rest_framework import status
from rest_framework.response import Response


'''
The response stucture for HTTP responses
'''
RESPONSE_STRUCT = {
    'data': '',
    'status': '',
    'msg': ''
}


'''
The predefined error messages
'''
ERROR_MSG = {
    'default': 'An error occurred while executing!',
    'dberr_get': 'Failed to fetch data due to some internal error!',
    'dberr_post': 'Failed to save the new record due to some internal error!',
    'dberr_put': 'Failed to update the record due to some internal error!',
    'dberr_del': 'Failed to remove the record due to some internal error!',
}

'''
Common HTTP errors
'''
RESPONSE_STATUS = {
    200: status.HTTP_200_OK,
    201: status.HTTP_201_CREATED,
    204: status.HTTP_204_NO_CONTENT,    
    400: status.HTTP_400_BAD_REQUEST,
    404: status.HTTP_404_NOT_FOUND,
    500: status.HTTP_500_INTERNAL_SERVER_ERROR,
}


'''
Prepares HTTPS success responses based on the response structure
'''
def prepareSuccessResponse(_data = '', _resCode = 200):
    res = copy.copy(RESPONSE_STRUCT)
    res['status'] = 'success'
    res['data'] = _data

    httpResObj = Response(data=res, status=RESPONSE_STATUS.get(_resCode, status.HTTP_200_OK))
    return httpResObj


'''
Prepares HTTPS error responses based on the response structure & error messages
'''
def prepareErrorResponse(_errorCode = '_default', _resCode = 500, _errorMessage = ''):
    res = copy.copy(RESPONSE_STRUCT)
    res['status'] = 'error'
    res['data'] = ERROR_MSG[_errorCode]
    if _errorMessage:        
        res['msg'] = str(_errorMessage).strip()      

    httpResObj = Response(data=res, status=RESPONSE_STATUS.get(_resCode, status.HTTP_400_BAD_REQUEST))
    return httpResObj
