// a typescript class to manage jwt access and refresh tokens with value and expiration

type AjsTokenInfo = {
    v: string | null;
    ex: Date | null;
};

type AjsTokensInfo = {
    accessToken: AjsTokenInfo;
    refreshToken: AjsTokenInfo;
};

export default class AjsSessionStorage {
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

    // get if the access token is valid with a 10 second buffer
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

    // get if the refresh token is valid with a 10 second buffer
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

    // a private function to extract expiration date from the jwt token
    private _extractExpirationDate(token: string): Date | null {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp) {
            const exp = new Date(payload.exp * 1000);
            return exp;
        }
        return null;
    }

    // set the access token and expiration date
    public setAccessToken(token: string): void {
        this._sessionTokens.accessToken.v = token;
        const exp = this._extractExpirationDate(token);
        if (exp) {
            this._sessionTokens.accessToken.ex = exp;
        }
    }

    // set the refresh token and expiration date
    public setRefreshToken(token: string): void {
        this._sessionTokens.refreshToken.v = token;
        const exp = this._extractExpirationDate(token);
        if (exp) {
            this._sessionTokens.refreshToken.ex = exp;
        }
    }
    // get the access token
    public getAccessToken(): AjsTokenInfo {
        return this._sessionTokens.accessToken;
    }
    // get the refresh token
    public getRefreshToken(): AjsTokenInfo {
        return this._sessionTokens.refreshToken;
    }
    // clear the access token
    public clearAccessToken(): void {
        this._sessionTokens.accessToken.v = null;
        this._sessionTokens.accessToken.ex = null;
    }
    // clear the refresh token
    public clearRefreshToken(): void {
        this._sessionTokens.refreshToken.v = null;
        this._sessionTokens.refreshToken.ex = null;
    }
    // clear all tokens
    public clearAllTokens(): void {
        this.clearAccessToken();
        this.clearRefreshToken();
    }
}
