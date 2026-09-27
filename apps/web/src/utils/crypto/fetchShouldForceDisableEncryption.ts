/*
Copyright 2026 Start9 Labs, Inc.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import { AutoDiscovery, type MatrixClient } from "matrix-js-sdk/src/matrix";

import SdkConfig from "../../SdkConfig";

/**
 * Like shouldForceDisableEncryption, for before the client has started and fetched its well-known.
 * `force_disable_encryption` in config.json decides without the well-known, for a deployment (or a local
 * homeserver without HTTPS) whose well-known the client cannot reach.
 */
export async function fetchShouldForceDisableEncryption(client: MatrixClient): Promise<boolean> {
    if (SdkConfig.get("force_disable_encryption")) return true;
    if (!SdkConfig.get("enable_client_well_known_lookups")) return false;
    const domain = client.getDomain();
    if (!domain) return false;
    const wellKnown = await AutoDiscovery.getRawClientConfig(domain);
    return wellKnown["io.element.e2ee"]?.["force_disable"] === true;
}
