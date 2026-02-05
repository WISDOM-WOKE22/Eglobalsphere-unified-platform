export function toQueryString(params: Record<string, any>): string {
    if (!params) return '';
    return Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(
            ([k, v]) =>
                encodeURIComponent(k) +
                '=' +
                encodeURIComponent(
                    typeof v === 'object' ? JSON.stringify(v) : String(v)
                )
        )
        .join('&');
}

export const renderPlate = (plate: string) => {
    return plate.split('').map((char: string) => (char === 'H' ? 'هـ' : char)).join('').replace("-","").replace(" ","").replace("_","").replace(/\s/g,"");
}