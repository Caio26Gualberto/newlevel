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


import * as runtime from '../runtime';
import type {
  DisplayActivityLocationDtoListNewLevelResponse,
} from '../models/index';
import {
    DisplayActivityLocationDtoListNewLevelResponseFromJSON,
    DisplayActivityLocationDtoListNewLevelResponseToJSON,
} from '../models/index';

/**
 * 
 */
export class CommonApi extends runtime.BaseAPI {

    /**
     */
    async apiCommonGetDisplayCitiesGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DisplayActivityLocationDtoListNewLevelResponse>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/Common/GetDisplayCities`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DisplayActivityLocationDtoListNewLevelResponseFromJSON(jsonValue));
    }

    /**
     */
    async apiCommonGetDisplayCitiesGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DisplayActivityLocationDtoListNewLevelResponse> {
        const response = await this.apiCommonGetDisplayCitiesGetRaw(initOverrides);
        return await response.value();
    }

}
