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
import type { ProfileInfoDto } from './ProfileInfoDto';
import {
    ProfileInfoDtoFromJSON,
    ProfileInfoDtoFromJSONTyped,
    ProfileInfoDtoToJSON,
} from './ProfileInfoDto';

/**
 * 
 * @export
 * @interface ProfileInfoDtoNewLevelResponse
 */
export interface ProfileInfoDtoNewLevelResponse {
    /**
     * 
     * @type {boolean}
     * @memberof ProfileInfoDtoNewLevelResponse
     */
    isSuccess?: boolean;
    /**
     * 
     * @type {string}
     * @memberof ProfileInfoDtoNewLevelResponse
     */
    message?: string;
    /**
     * 
     * @type {ProfileInfoDto}
     * @memberof ProfileInfoDtoNewLevelResponse
     */
    data?: ProfileInfoDto;
}

/**
 * Check if a given object implements the ProfileInfoDtoNewLevelResponse interface.
 */
export function instanceOfProfileInfoDtoNewLevelResponse(value: object): boolean {
    return true;
}

export function ProfileInfoDtoNewLevelResponseFromJSON(json: any): ProfileInfoDtoNewLevelResponse {
    return ProfileInfoDtoNewLevelResponseFromJSONTyped(json, false);
}

export function ProfileInfoDtoNewLevelResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProfileInfoDtoNewLevelResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'isSuccess': json['isSuccess'] == null ? undefined : json['isSuccess'],
        'message': json['message'] == null ? undefined : json['message'],
        'data': json['data'] == null ? undefined : ProfileInfoDtoFromJSON(json['data']),
    };
}

export function ProfileInfoDtoNewLevelResponseToJSON(value?: ProfileInfoDtoNewLevelResponse | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'isSuccess': value['isSuccess'],
        'message': value['message'],
        'data': ProfileInfoDtoToJSON(value['data']),
    };
}
