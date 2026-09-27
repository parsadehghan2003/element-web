/*
Copyright 2026 Start9 Labs, Inc.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import { type MatrixClient } from "matrix-js-sdk/src/matrix";

import { MatrixClientPeg } from "../../MatrixClientPeg";

/**
 * Whether this session runs without crypto, for class components that can't use `useCryptoDisabled()`. A client
 * that can't say (none yet, or a partial one in tests) counts as having crypto, keeping upstream's behaviour.
 */
export function isCryptoDisabled(client: MatrixClient | null = MatrixClientPeg.get()): boolean {
    return typeof client?.getCrypto === "function" && !client.getCrypto();
}
