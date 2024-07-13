import { create } from "zustand";

export const useThemeState = create((set) => ({
    theme: 'light',
    setTheme: (th) => set({ theme: th })
}))

export const useNavState = create((set) => ({
    isNavActive: true,
    setNavActive: (s) => set({ isNavActive: s })
}))


export const useUserAuthState = create((set) => ({
    userAuth: {},
    setUserAuth: (data) => set({ userAuth: data })
}))

export const useLoaderState = create((set) => ({
    showLoader: true,
    setShowLoader: (data) => set({ showLoader: data })
}))

export const useNavMenuState = create((set) => ({
    navList: [],
    setNavList: (data) => set({ navList: data })
}))

export const useNavMenuLoadedState = create((set) => ({
    isLoaded: false,
    setIsLoaded: (st) => set({ isLoadedL: st })
}))
export const usePolicyState = create((set) => ({
    hasReadPolicy: false,
    setHasReadPolicy: (st) => set({ hasReadPolicy: st })
}))
export const useWindowState = create((set) => ({
    isMobile: false,
    setIsMobile: (st) => set({ isMobile: st })
}))
