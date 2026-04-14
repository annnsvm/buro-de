import React from "react"

type HeaderNavBarProps = {
    pathname: string,
    isLight: boolean,
    className: string
}

type HeaderNavAuthTrialProps = {
    isLight: boolean,
    className: string,
    from?: string
}

type HeaderMobileMenuRenderNavArgs = {
    pathname: string;
    isLight: boolean;
    className: string;
};

type HeaderMobileMenuProps = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isLight: boolean,
    pathname: string,
    className: string,
    renderNav?: (args: HeaderMobileMenuRenderNavArgs) => React.ReactNode;
    courseWorkspaceOverlay?: boolean;
}

export type {
    HeaderNavBarProps,
    HeaderNavAuthTrialProps,
    HeaderMobileMenuProps,
    HeaderMobileMenuRenderNavArgs,
}