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
import type { CommentsPhotoResponseDto } from './CommentsPhotoResponseDto';
import {
    CommentsPhotoResponseDtoFromJSON,
    CommentsPhotoResponseDtoFromJSONTyped,
    CommentsPhotoResponseDtoToJSON,
} from './CommentsPhotoResponseDto';

/**
 * 
 * @export
 * @interface CommentsPhotoResponseDtoNewLevelResponse
 */
export interface CommentsPhotoResponseDtoNewLevelResponse {
    /**
     * 
     * @type {boolean}
     * @memberof CommentsPhotoResponseDtoNewLevelResponse
     */
    isSuccess?: boolean;
    /**
     * 
     * @type {string}
     * @memberof CommentsPhotoResponseDtoNewLevelResponse
     */
    message?: string;
    /**
     * 
     * @type {CommentsPhotoResponseDto}
     * @memberof CommentsPhotoResponseDtoNewLevelResponse
     */
    data?: CommentsPhotoResponseDto;
}

/**
 * Check if a given object implements the CommentsPhotoResponseDtoNewLevelResponse interface.
 */
export function instanceOfCommentsPhotoResponseDtoNewLevelResponse(value: object): boolean {
    return true;
}

export function CommentsPhotoResponseDtoNewLevelResponseFromJSON(json: any): CommentsPhotoResponseDtoNewLevelResponse {
    return CommentsPhotoResponseDtoNewLevelResponseFromJSONTyped(json, false);
}

export function CommentsPhotoResponseDtoNewLevelResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): CommentsPhotoResponseDtoNewLevelResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'isSuccess': json['isSuccess'] == null ? undefined : json['isSuccess'],
        'message': json['message'] == null ? undefined : json['message'],
        'data': json['data'] == null ? undefined : CommentsPhotoResponseDtoFromJSON(json['data']),
    };
}

export function CommentsPhotoResponseDtoNewLevelResponseToJSON(value?: CommentsPhotoResponseDtoNewLevelResponse | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'isSuccess': value['isSuccess'],
        'message': value['message'],
        'data': CommentsPhotoResponseDtoToJSON(value['data']),
    };
}
