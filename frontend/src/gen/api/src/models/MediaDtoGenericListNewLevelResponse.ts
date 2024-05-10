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
import type { MediaDtoGenericList } from './MediaDtoGenericList';
import {
    MediaDtoGenericListFromJSON,
    MediaDtoGenericListFromJSONTyped,
    MediaDtoGenericListToJSON,
} from './MediaDtoGenericList';

/**
 * 
 * @export
 * @interface MediaDtoGenericListNewLevelResponse
 */
export interface MediaDtoGenericListNewLevelResponse {
    /**
     * 
     * @type {boolean}
     * @memberof MediaDtoGenericListNewLevelResponse
     */
    isSuccess?: boolean;
    /**
     * 
     * @type {string}
     * @memberof MediaDtoGenericListNewLevelResponse
     */
    message?: string;
    /**
     * 
     * @type {MediaDtoGenericList}
     * @memberof MediaDtoGenericListNewLevelResponse
     */
    data?: MediaDtoGenericList;
}

/**
 * Check if a given object implements the MediaDtoGenericListNewLevelResponse interface.
 */
export function instanceOfMediaDtoGenericListNewLevelResponse(value: object): boolean {
    return true;
}

export function MediaDtoGenericListNewLevelResponseFromJSON(json: any): MediaDtoGenericListNewLevelResponse {
    return MediaDtoGenericListNewLevelResponseFromJSONTyped(json, false);
}

export function MediaDtoGenericListNewLevelResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): MediaDtoGenericListNewLevelResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'isSuccess': json['isSuccess'] == null ? undefined : json['isSuccess'],
        'message': json['message'] == null ? undefined : json['message'],
        'data': json['data'] == null ? undefined : MediaDtoGenericListFromJSON(json['data']),
    };
}

export function MediaDtoGenericListNewLevelResponseToJSON(value?: MediaDtoGenericListNewLevelResponse | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'isSuccess': value['isSuccess'],
        'message': value['message'],
        'data': MediaDtoGenericListToJSON(value['data']),
    };
}
