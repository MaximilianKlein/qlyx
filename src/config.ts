
import { Value } from "@sinclair/typebox/value";
import { Static, t } from "elysia";

export const adminPassword = () => process.env.ADM_PWD;

// don't set a leaderboard password if you want everybody to be able to access it.
export const protectLeaderboard = () => process.env.PROTECT_LEADERBOARD;

const LocationConfigType = t.Object({
    location: t.String(),
    label: t.String(),
});

export type LocationConfig = Static<typeof LocationConfigType>;

export const locationConfig = (): LocationConfig[] => {
    try {
        // base64Decode('W10=') = '[]'
        const locationConfigData = JSON.parse(Buffer.from(process.env.LOCATION_CONFIG ?? 'W10=', 'base64').toString('utf-8'));

        // @ts-ignore Why ever this doesn't work
        return Value.Convert(t.Array(LocationConfigType), locationConfigData);
    } catch (e) {
        return [];
    }
}
