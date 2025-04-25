type AjsTokenInfo = {
    v: string | null; // Token value
    ex: Date | null; // Token expiration date
};

type AjsTokensInfo = {
    accessToken: AjsTokenInfo; // Information about the access token
    refreshToken: AjsTokenInfo; // Information about the refresh token
};

export default class AjsSessionStorage {
    // Internal storage for session tokens
    private _sessionTokens: AjsTokensInfo = {
        accessToken: {
            v: null,
            ex: null
        },
        refreshToken: {
            v: null,
            ex: null
        }
    };

    /**
     * Checks if the access token is valid with a 10-second buffer.
     * @returns `true` if the access token is valid, otherwise `false`.
     */
    public isAccessTokenValid(): boolean {
        const accessToken = this._sessionTokens.accessToken;
        if (accessToken.v && accessToken.ex) {
            const now = new Date();
            const buffer = 10 * 1000; // 10 seconds
            if (accessToken.ex.getTime() > now.getTime() + buffer) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if the refresh token is valid with a 10-second buffer.
     * @returns `true` if the refresh token is valid, otherwise `false`.
     */
    public isRefreshTokenValid(): boolean {
        const refreshToken = this._sessionTokens.refreshToken;
        if (refreshToken.v && refreshToken.ex) {
            const now = new Date();
            const buffer = 10 * 1000; // 10 seconds
            if (refreshToken.ex.getTime() > now.getTime() + buffer) {
                return true;
            }
        }
        return false;
    }

    /**
     * Extracts the expiration date from a JWT token.
     * @param token - The JWT token string.
     * @returns The expiration date as a `Date` object, or `null` if invalid.
     */
    private _extractExpirationDate(token: string): Date | null {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null; // Invalid JWT format
            }
            const payload = JSON.parse(atob(parts[1])); // Decode the payload
            if (payload.exp) {
                const exp = new Date(payload.exp * 1000); // Convert expiration to milliseconds
                return exp;
            }
            return null;
        } catch (error) {
            console.error(
                'Error extracting expiration date from token:',
                error
            );
            return null;
        }
    }

    /**
     * Sets the access token and its expiration date.
     * @param token - The JWT access token string.
     */
    public setAccessToken(token: string): void {
        this._sessionTokens.accessToken.v = token;
        const exp = this._extractExpirationDate(token);
        if (exp) {
            this._sessionTokens.accessToken.ex = exp;
        }
    }

    /**
     * Sets the refresh token and its expiration date.
     * @param token - The JWT refresh token string.
     */
    public setRefreshToken(token: string): void {
        this._sessionTokens.refreshToken.v = token;
        const exp = this._extractExpirationDate(token);
        if (exp) {
            this._sessionTokens.refreshToken.ex = exp;
        }
    }

    /**
     * Retrieves the access token information.
     * @returns An object containing the access token value and expiration date.
     */
    public getAccessToken(): AjsTokenInfo {
        return this._sessionTokens.accessToken;
    }

    /**
     * Retrieves the refresh token information.
     * @returns An object containing the refresh token value and expiration date.
     */
    public getRefreshToken(): AjsTokenInfo {
        return this._sessionTokens.refreshToken;
    }

    /**
     * Clears the access token from storage.
     */
    public clearAccessToken(): void {
        this._sessionTokens.accessToken.v = null;
        this._sessionTokens.accessToken.ex = null;
    }

    /**
     * Clears the refresh token from storage.
     */
    public clearRefreshToken(): void {
        this._sessionTokens.refreshToken.v = null;
        this._sessionTokens.refreshToken.ex = null;
    }

    /**
     * Clears both the access and refresh tokens from storage.
     */
    public clearAllTokens(): void {
        this.clearAccessToken();
        this.clearRefreshToken();
    }
}
