import { ServerResponse } from "http";

interface NextRedirectOptions {
    to: string,
    res: ServerResponse
}

export const nextRedirect = async ({to, res}: NextRedirectOptions) => {
    
    return {redirect: to, notFound: true, props: {}}

}