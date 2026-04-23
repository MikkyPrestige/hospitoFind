import {continentData} from "@/components/constants/outbreakConstants"

export type Article = {
    title: string;
    description: string;
    link: string;
    image_url?: string;
    pubDate?: string;
    source_id?: string;
};

export interface UseHealthNewsReturn {
    articles: Article[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export type Tip = {
    Title: string;
    ImageUrl: string;
    ImageAlt: string;
    Link: string;
    Category?: string;
};

export type Alert = {
    title: string;
    source: string;
    date: string;
    summary: string;
    link: string;
};

export interface UseOutbreaksReturn {
    alerts: Alert[];
    loading: boolean;
    error: string | null;
    selectedContinent: string;
    setSelectedContinent: (code: string) => void;
    activeData: typeof continentData.GLOBAL;
    refetch: () => void;
}