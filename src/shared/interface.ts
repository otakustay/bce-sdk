export interface BceCredential {
    ak: string;
    sk: string;
}

export interface BceCredentialContext {
    credentials: BceCredential;
    sessionToken?: string;
}

export interface RegionClientOptions extends BceCredentialContext {
    region: string;
}
