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
import type { PhotoResponseDto } from './PhotoResponseDto';
import {
    PhotoResponseDtoFromJSON,
    PhotoResponseDtoFromJSONTyped,
    PhotoResponseDtoToJSON,
} from './PhotoResponseDto';

/**
 * 
 * @export
 * @interface PhotoResponseDtoGenericList
 */
export interface PhotoResponseDtoGenericList {
    /**
     * 
     * @type {number}
     * @memberof PhotoResponseDtoGenericList
     */
    totalCount?: number;
    /**
     * 
     * @type {Array<PhotoResponseDto>}
     * @memberof PhotoResponseDtoGenericList
     */
    items?: Array<PhotoResponseDto>;
}

/**
 * Check if a given object implements the PhotoResponseDtoGenericList interface.
 */
export function instanceOfPhotoResponseDtoGenericList(value: object): boolean {
    return true;
}

export function PhotoResponseDtoGenericListFromJSON(json: any): PhotoResponseDtoGenericList {
    return PhotoResponseDtoGenericListFromJSONTyped(json, false);
}

export function PhotoResponseDtoGenericListFromJSONTyped(json: any, ignoreDiscriminator: boolean): PhotoResponseDtoGenericList {
    if (json == null) {
        return json;
    }
    return {
        
        'totalCount': json['totalCount'] == null ? undefined : json['totalCount'],
        'items': json['items'] == null ? undefined : ((json['items'] as Array<any>).map(PhotoResponseDtoFromJSON)),
    };
}

export function PhotoResponseDtoGenericListToJSON(value?: PhotoResponseDtoGenericList | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'totalCount': value['totalCount'],
        'items': value['items'] == null ? undefined : ((value['items'] as Array<any>).map(PhotoResponseDtoToJSON)),
    };
}

