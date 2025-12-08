"use client";
import React, { useCallback, useState, forwardRef, useEffect } from "react";
import { parseCookies, setCookie } from "nookies";
import { LanguageDescriptor } from "@/types";
import { DEFAULT_LANGUAGES } from "@/constants";

// shadcn
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// utils
import { cn } from "@/lib/utils";

// assets
import { ChevronDown, ChevronsUpDown, CheckIcon, Globe, Languages } from "lucide-react";
import { CircleFlag } from "react-circle-flags";

// data
import { countries } from "country-data-list";

// Google Translate cookie name
const GOOGLE_TRANSLATE_COOKIE = "googtrans";

// Language helpers
const readLanguageFromCookie = (): string | null => {
    const cookies = parseCookies();
    const existingLanguageCookieValue = cookies[GOOGLE_TRANSLATE_COOKIE];
    if (existingLanguageCookieValue) {
        const segments = existingLanguageCookieValue.split("/");
        if (segments.length > 2) return segments[2];
    }
    return null;
};

declare global {
    namespace globalThis {
        var __GOOGLE_TRANSLATION_CONFIG__: {
            languages: LanguageDescriptor[];
            defaultLanguage: string;
        };
    }
}

// The following cookie name is important because it's Google-predefined for the translation engine purpose
const COOKIE_NAME = "googtrans";

// We should know a predefined nickname of a language and provide its title (the name for displaying)
// Types for JS-based declarations in public/assets/scripts/lang-config.js
const writeLanguageCookie = (langCode: string): void => {
    const domain = window.location.hostname;
    const domainParts = domain.split(".");
    const rootDomain =
        domainParts.length > 1
            ? domainParts.slice(-2).join(".") // Get root domain (e.g., example.com)
            : domain;

    // Set cookie for current domain
    setCookie(null, GOOGLE_TRANSLATE_COOKIE, "/auto/" + langCode, {
        path: "/",
        sameSite: "lax",
    });

    // Also set for root domain to cover all subdomains
    if (domainParts.length > 2) {
        setCookie(null, GOOGLE_TRANSLATE_COOKIE, "/auto/" + langCode, {
            domain: "." + rootDomain,
            path: "/",
            sameSite: "lax",
        });
    }

    if (domainParts.length > 2) {
        setCookie(null, GOOGLE_TRANSLATE_COOKIE, "/auto/" + langCode, {
            domain: ".amidarh.com",
            path: "/",
            sameSite: "lax",
        });
    }
};

const applyLanguageChange = (
    langCode: string,
    onLanguageChange?: (language: string) => void
): void => {
    writeLanguageCookie(langCode);
    onLanguageChange?.(langCode);

    // Only reload if we're in the browser
    if (typeof window !== "undefined") {
        // Add a small delay to ensure cookies are set before reload
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }
};

// Shared hook for current language
const useGoogleTranslateLanguage = (initial: string) => {
    const [currentLanguage, setCurrentLanguage] = useState<string>(initial);

    useEffect(() => {
        // setCurrentLanguage('en');
        const fromCookie = readLanguageFromCookie();
        if (fromCookie) {
            setCurrentLanguage(fromCookie);
            return;
        }
        if (typeof window !== "undefined" && (window as any).__GOOGLE_TRANSLATION_CONFIG__) {
            const defaultLanguage =
                (window as any).__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage || initial;
            setCurrentLanguage(defaultLanguage);
        }
    }, [initial]);

    const changeLanguage = useCallback(
        (langCode: string, onLanguageChange?: (language: string) => void) => {
            // setCurrentLanguage('en');
            setCurrentLanguage(langCode);
            applyLanguageChange(langCode, onLanguageChange);
        },
        []
    );

    return { currentLanguage, changeLanguage };
};

// Get language from country code
const getLanguageFromCountry = (countryCode: string): string => {
    const country = countries.all.find((c: any) => c.alpha2 === countryCode);
    return country?.languages?.[0] || "en";
};

// Country type
export type Country = {
    alpha2: string;
    alpha3: string;
    countryCallingCodes: string[];
    currencies: string[];
    emoji?: string;
    ioc: string;
    languages: string[];
    name: string;
    status: string;
};

type BaseCountryDropdownProps = {
    options?: Country[];
    languages?: LanguageDescriptor[];
    disabled?: boolean;
    placeholder?: string;
    slim?: boolean;
    inline?: boolean;
    className?: string;
    showLanguageSwitch?: boolean;
    onLanguageChange?: (language: string) => void;
};

type SingleCountryDropdownProps = BaseCountryDropdownProps & {
    multiple?: false;
    onChange?: (country: Country) => void;
    defaultValue?: string;
};

type MultipleCountryDropdownProps = BaseCountryDropdownProps & {
    multiple: true;
    onChange: (countries: Country[]) => void;
    defaultValue?: string[];
};

type CountryDropdownProps = SingleCountryDropdownProps | MultipleCountryDropdownProps;

// Reusable language item
type LanguageItemProps = {
    code: string;
    name: string;
    flag: string;
    active: boolean;
    onSelect: (code: string) => void;
};

const LanguageItem = React.memo(({ code, name, flag, active, onSelect }: LanguageItemProps) => (
    <button
        onClick={() => onSelect(code)}
        className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground",
            active && "bg-accent text-accent-foreground"
        )}
    >
        <CircleFlag countryCode={flag.toLowerCase()} height={16} className="shrink-0" />
        <span>{name}</span>
        {active && <CheckIcon className="ml-2 h-4 w-4 text-primary" />}
    </button>
));
LanguageItem.displayName = "LanguageItem";

const CountryLanguageSelectComponent = (
    {
        options = (countries.all as any[]).filter(
            (country: any) => country.emoji && country.status !== "deleted" && country.ioc !== "PRK"
        ),
        languages = DEFAULT_LANGUAGES,
        onChange,
        defaultValue,
        disabled = false,
        placeholder = "Select a country",
        slim = false,
        inline = false,
        multiple = false,
        showLanguageSwitch = true,
        onLanguageChange,
        className,
        ...props
    }: CountryDropdownProps,
    ref: React.ForwardedRef<HTMLButtonElement>
) => {
    const [open, setOpen] = useState(false);
    const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
    const { currentLanguage, changeLanguage } = useGoogleTranslateLanguage("en");
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);

    // (Language init handled by hook)

    // Handle country selection and language initialization
    useEffect(() => {
        // Skip if no defaultValue
        if (!defaultValue) {
            if (selectedCountries.length > 0) {
                setSelectedCountries([]);
            }
            return;
        }

        // For multiple selection
        if (multiple && Array.isArray(defaultValue)) {
            const currentValues = selectedCountries.map(c => c.alpha3);
            const hasChanges =
                defaultValue.length !== currentValues.length ||
                !defaultValue.every(v => currentValues.includes(v));

            if (hasChanges) {
                const initialCountries = options.filter(country => defaultValue.includes(country.alpha3));
                setSelectedCountries(initialCountries);
            }
        }
        // For single selection
        else if (!multiple && typeof defaultValue === "string") {
            const currentValue = selectedCountries[0]?.alpha3;
            if (defaultValue !== currentValue) {
                const initialCountry = options.find(country => country.alpha3 === defaultValue);
                setSelectedCountries(initialCountry ? [initialCountry] : []);

                // No implicit language change here; language is user-controlled
            }
        }
    }, [defaultValue, options, multiple]);

    const handleSelect = useCallback(
        (country: Country) => {
            if (multiple) {
                const newSelection = selectedCountries.some(c => c.alpha3 === country.alpha3)
                    ? selectedCountries.filter(c => c.alpha3 !== country.alpha3)
                    : [...selectedCountries, country];

                setSelectedCountries(newSelection);
                (onChange as MultipleCountryDropdownProps["onChange"])?.(newSelection);
            } else {
                setSelectedCountries([country]);
                (onChange as SingleCountryDropdownProps["onChange"])?.(country);
                setOpen(false);

                // Update language based on selected country
                const langCode = getLanguageFromCountry(country.alpha2);
                if (langCode && langCode !== currentLanguage) {
                    changeLanguage(langCode, onLanguageChange);
                }
            }
        },
        [onChange, multiple, selectedCountries, currentLanguage, onLanguageChange, changeLanguage]
    );

    const handleLanguageChange = (langCode: string) => {
        changeLanguage(langCode, onLanguageChange);
        setShowLanguageMenu(false);
    };

    const triggerClasses = cn(
        "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 hover:bg-secondary/80",
        slim === true && "gap-1 w-min",
        inline && "rounded-r-none border-r-0 gap-1 pr-1 w-min",
        className
    );

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger ref={ref} className={triggerClasses} disabled={disabled} {...props}>
                    {selectedCountries.length > 0 ? (
                        <div className="flex items-center flex-grow gap-2 overflow-hidden">
                            {multiple ? (
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                    {selectedCountries.length} selected
                                </span>
                            ) : (
                                <>
                                    <div className="inline-flex items-center justify-center w-4 h-4 shrink-0 overflow-hidden rounded-full">
                                        <CircleFlag
                                            countryCode={selectedCountries[0].alpha2.toLowerCase()}
                                            height={16}
                                        />
                                    </div>
                                    {slim === false && !inline && (
                                        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                            {selectedCountries[0].name}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <span className="flex items-center gap-2">
                            {inline || slim ? <Globe size={16} /> : placeholder}
                        </span>
                    )}

                    {!inline ? (
                        <ChevronDown size={16} />
                    ) : (
                        <ChevronsUpDown size={16} className="text-muted-foreground" />
                    )}
                </PopoverTrigger>

                {/* Country Selection Dropdown */}
                <PopoverContent
                    collisionPadding={10}
                    side="bottom"
                    className="min-w-[--radix-popper-anchor-width] p-0"
                >
                    <Command className="w-full max-h-[200px] sm:max-h-[270px]">
                        <CommandList>
                            <div className="sticky top-0 z-10 bg-popover">
                                <CommandInput placeholder="Search country..." />
                            </div>
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                                {options
                                    .filter(x => x.name)
                                    .map(option => (
                                        <CommandItem
                                            className="flex items-center w-full gap-2"
                                            key={option.alpha3}
                                            onSelect={() => handleSelect(option)}
                                        >
                                            <div className="flex flex-grow space-x-2 overflow-hidden">
                                                <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                                                    <CircleFlag countryCode={option.alpha2.toLowerCase()} height={20} />
                                                </div>
                                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {option.name}
                                                </span>
                                            </div>
                                            <CheckIcon
                                                className={cn(
                                                    "ml-auto h-4 w-4 shrink-0",
                                                    selectedCountries.some(c => c.alpha3 === option.alpha3)
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Language Switcher */}
            {showLanguageSwitch && (
                <Popover open={showLanguageMenu} onOpenChange={setShowLanguageMenu}>
                    <PopoverTrigger
                        className={cn(
                            "flex items-center justify-center p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
                            showLanguageMenu && "bg-accent text-accent-foreground"
                        )}
                        disabled={disabled}
                    >
                        <Languages size={18} />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2" align="end" sideOffset={5}>
                        <div className="flex flex-col gap-1">
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground",
                                        currentLanguage === lang.code && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    <CircleFlag
                                        countryCode={lang.flag.toLowerCase()}
                                        height={16}
                                        className="shrink-0"
                                    />
                                    <span>{lang.name}</span>
                                    {currentLanguage === lang.code && (
                                        <CheckIcon className="ml-2 h-4 w-4 text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
};

const CountryLanguageSelectWithRef = forwardRef<HTMLButtonElement, CountryDropdownProps>(
    (props, ref) => CountryLanguageSelectComponent(props, ref)
);
CountryLanguageSelectWithRef.displayName = "CountryLanguageSelect";

export const CountryLanguageSelect = CountryLanguageSelectWithRef;

// Backward compatibility
type CountryDropdownSinglePropsCompat = Omit<SingleCountryDropdownProps, "multiple">;

export const CountryDropdown = forwardRef<HTMLButtonElement, CountryDropdownSinglePropsCompat>(
    (props, ref) => <CountryLanguageSelect {...props} showLanguageSwitch={false} ref={ref} />
);
CountryDropdown.displayName = "CountryDropdown";

// Language Switcher Component
export const LanguageSwitcher = () => {
    const { currentLanguage, changeLanguage } = useGoogleTranslateLanguage("ar");
    const [isOpen, setIsOpen] = useState(false);

    const switchLanguage = (langCode: string) => () => {
        changeLanguage(langCode);
    };

    const currentLang =
        DEFAULT_LANGUAGES.find(lang => lang.code === currentLanguage) || DEFAULT_LANGUAGES[0];

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger className="flex items-center gap-2 p-2 hover:bg-accent hover:text-accent-foreground rounded-full cursor-pointer">
                <CircleFlag countryCode={currentLang.flag.toLowerCase()} className="size-7" />
                {/* <span className="hidden sm:inline">{currentLang.name}</span> */}
                {/* <ChevronDown size={16} className="opacity-50" /> */}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="end" sideOffset={5}>
                <div className="flex flex-col gap-1">
                    {DEFAULT_LANGUAGES.map(lang => (
                        <button
                            key={lang.code}
                            onClick={switchLanguage(lang.code)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground",
                                currentLanguage === lang.code && "bg-accent text-accent-foreground"
                            )}
                        >
                            <CircleFlag
                                countryCode={lang.flag.toLowerCase()}
                                height={16}
                                className="shrink-0 size-5"
                            />
                            <span>{lang.name}</span>
                            {currentLanguage === lang.code && <CheckIcon className="ml-2 h-4 w-4 text-primary" />}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export { GOOGLE_TRANSLATE_COOKIE };
