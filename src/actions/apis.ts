import { ApiResponse } from "@/types";

const download = async (language: string, version: string, content: string): Promise<ApiResponse> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_NEXUS_FETCHER_API_ENDPOINT}/upload?language=${language}&version=${version}`, {
        method: 'POST',
        body: content,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let message;
    try {
        message = await res.json();
    } catch (error) {
        message = 'response is not valid';
    }
    return {
        isSuccess: res.status === 200,
        message: message
    } as ApiResponse;
}

export { download }