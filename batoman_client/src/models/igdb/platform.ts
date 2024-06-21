export enum PlatformCategory {
    console = 1,
    arcade = 2,
    platform = 3,
    operating_system = 4,
    portable_console = 5,
    computer = 6,
}

export type PlatformLogo = {
    model_type: "platform_logos";
    id: number;
    url: string;
    alpha_channel: boolean;
    animated: boolean;
    height: number;
    image_id: string;
    width: number;
    uuid: string;
};

export type PlatformFamily = {
    model_type: "platform_families";
    id: number;
    url: string | null;
    name: string;
    slug: string;
    uuid: string;
};

export type PlatformModel = {
    model_type: "platforms";
    uuid: string;
    id: number;
    url: string;
    category: PlatformCategory;
    generation: number | null;
    name: string;
    slug: string;
    platform_logo: PlatformLogo | null;
    platform_family: PlatformFamily | null;
    summary: string | null;
};
