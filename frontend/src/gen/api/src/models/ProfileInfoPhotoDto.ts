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
/**
 * 
 * @export
 * @interface ProfileInfoPhotoDto
 */
export interface ProfileInfoPhotoDto {
    /**
     * 
     * @type {number}
     * @memberof ProfileInfoPhotoDto
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof ProfileInfoPhotoDto
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof ProfileInfoPhotoDto
     */
    photoSrc?: string;
}

/**
 * Check if a given object implements the ProfileInfoPhotoDto interface.
 */
export function instanceOfProfileInfoPhotoDto(value: object): boolean {
    return true;
}

export function ProfileInfoPhotoDtoFromJSON(json: any): ProfileInfoPhotoDto {
    return ProfileInfoPhotoDtoFromJSONTyped(json, false);
}

export function ProfileInfoPhotoDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProfileInfoPhotoDto {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'title': json['title'] == null ? undefined : json['title'],
        'photoSrc': json['photoSrc'] == null ? undefined : json['photoSrc'],
    };
}

export function ProfileInfoPhotoDtoToJSON(value?: ProfileInfoPhotoDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'id': value['id'],
        'title': value['title'],
        'photoSrc': value['photoSrc'],
    };
}
