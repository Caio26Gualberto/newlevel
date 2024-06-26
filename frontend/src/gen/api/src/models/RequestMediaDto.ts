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
 * @interface RequestMediaDto
 */
export interface RequestMediaDto {
    /**
     * 
     * @type {string}
     * @memberof RequestMediaDto
     */
    src?: string;
    /**
     * 
     * @type {string}
     * @memberof RequestMediaDto
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof RequestMediaDto
     */
    description?: string;
}

/**
 * Check if a given object implements the RequestMediaDto interface.
 */
export function instanceOfRequestMediaDto(value: object): boolean {
    return true;
}

export function RequestMediaDtoFromJSON(json: any): RequestMediaDto {
    return RequestMediaDtoFromJSONTyped(json, false);
}

export function RequestMediaDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): RequestMediaDto {
    if (json == null) {
        return json;
    }
    return {
        
        'src': json['src'] == null ? undefined : json['src'],
        'title': json['title'] == null ? undefined : json['title'],
        'description': json['description'] == null ? undefined : json['description'],
    };
}

export function RequestMediaDtoToJSON(value?: RequestMediaDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'src': value['src'],
        'title': value['title'],
        'description': value['description'],
    };
}

