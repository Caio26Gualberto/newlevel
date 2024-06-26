/* tslint:disable */
/* eslint-disable */
/**
 * NewLevel
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { LoginResponseDto } from './LoginResponseDto';
import {
    LoginResponseDtoFromJSON,
    LoginResponseDtoFromJSONTyped,
    LoginResponseDtoToJSON,
} from './LoginResponseDto';

/**
 * 
 * @export
 * @interface LoginResponseDtoNewLevelResponse
 */
export interface LoginResponseDtoNewLevelResponse {
    /**
     * 
     * @type {boolean}
     * @memberof LoginResponseDtoNewLevelResponse
     */
    isSuccess?: boolean;
    /**
     * 
     * @type {string}
     * @memberof LoginResponseDtoNewLevelResponse
     */
    message?: string;
    /**
     * 
     * @type {LoginResponseDto}
     * @memberof LoginResponseDtoNewLevelResponse
     */
    data?: LoginResponseDto;
}

/**
 * Check if a given object implements the LoginResponseDtoNewLevelResponse interface.
 */
export function instanceOfLoginResponseDtoNewLevelResponse(value: object): boolean {
    return true;
}

export function LoginResponseDtoNewLevelResponseFromJSON(json: any): LoginResponseDtoNewLevelResponse {
    return LoginResponseDtoNewLevelResponseFromJSONTyped(json, false);
}

export function LoginResponseDtoNewLevelResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): LoginResponseDtoNewLevelResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'isSuccess': json['isSuccess'] == null ? undefined : json['isSuccess'],
        'message': json['message'] == null ? undefined : json['message'],
        'data': json['data'] == null ? undefined : LoginResponseDtoFromJSON(json['data']),
    };
}

export function LoginResponseDtoNewLevelResponseToJSON(value?: LoginResponseDtoNewLevelResponse | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'isSuccess': value['isSuccess'],
        'message': value['message'],
        'data': LoginResponseDtoToJSON(value['data']),
    };
}

