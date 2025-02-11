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
 * @interface ProfileInfoVideoDto
 */
export interface ProfileInfoVideoDto {
    /**
     * 
     * @type {number}
     * @memberof ProfileInfoVideoDto
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof ProfileInfoVideoDto
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof ProfileInfoVideoDto
     */
    mediaSrc?: string;
}

/**
 * Check if a given object implements the ProfileInfoVideoDto interface.
 */
export function instanceOfProfileInfoVideoDto(value: object): boolean {
    return true;
}

export function ProfileInfoVideoDtoFromJSON(json: any): ProfileInfoVideoDto {
    return ProfileInfoVideoDtoFromJSONTyped(json, false);
}

export function ProfileInfoVideoDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProfileInfoVideoDto {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'title': json['title'] == null ? undefined : json['title'],
        'mediaSrc': json['mediaSrc'] == null ? undefined : json['mediaSrc'],
    };
}

export function ProfileInfoVideoDtoToJSON(value?: ProfileInfoVideoDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'id': value['id'],
        'title': value['title'],
        'mediaSrc': value['mediaSrc'],
    };
}

