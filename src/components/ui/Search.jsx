import { useEffect, useRef, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearchProducts } from "../../api/component/productApi";

/**
 * SearchInput
 * -----------
 * - Debounces requests (250ms) so typing doesn't spam the API.
 * - ⌘K / Ctrl+K global shortcut to focus.
 * - Arrow keys navigate results; Enter selects; Esc closes.
 * - Click-outside closes the dropdown.
 * - Handles loading and empty states.
 * - Guards against missing variant/thumbnail.
 *
 * Props:
 *   autoFocus  – focus the input on mount
 *   onSelect   – callback fired after a result is chosen (useful to close a mobile drawer)
 */
const SearchInput = ({ autoFocus = false, onSelect }) => {
  const [value, setValue] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Debounce input into `debounced` — the query hook uses this
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value.trim()), 250);
    return () => clearTimeout(id);
  }, [value]);

  const { data: rawResults, isFetching } = useSearchProducts(debounced);
  const results = Array.isArray(rawResults) ? rawResults : [];

  const showDropdown =
    open && debounced.length > 0 && (isFetching || results.length >= 0);

  /* --------------------------- Keyboard shortcut ---------------------------- */
  useEffect(() => {
    const onKey = (e) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const cmd = isMac ? e.metaKey : e.ctrlKey;
      if (cmd && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* --------------------------- Click outside -------------------------------- */
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  /* --------------------------- Autofocus ------------------------------------ */
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  /* --------------------------- Handlers ------------------------------------ */
  const handleSelect = (product) => {
    navigate(`/products/${product.slug}`);
    setValue("");
    setDebounced("");
    setOpen(false);
    setHighlight(-1);
    onSelect?.(product);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!showDropdown || results.length === 0) {
      if (e.key === "Enter" && debounced) {
        navigate(`/products?q=${encodeURIComponent(debounced)}`);
        setOpen(false);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((p) => (p < results.length - 1 ? p + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((p) => (p > 0 ? p - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlight >= 0) {
        handleSelect(results[highlight]);
      } else {
        navigate(`/products?q=${encodeURIComponent(debounced)}`);
        setOpen(false);
      }
    }
  };

  const handleClear = () => {
    setValue("");
    setDebounced("");
    setHighlight(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <div
        className={`flex items-center gap-2 rounded-lg border bg-white transition-colors ${
          open
            ? "border-neutral-900"
            : "border-neutral-200 hover:border-neutral-300"
        }`}
      >
        <Search
          size={16}
          className="ml-3 shrink-0 text-neutral-400"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setHighlight(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products, brands…"
          className="w-full bg-transparent py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="search-listbox"
          aria-autocomplete="list"
        />
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="mr-1 inline-flex h-6 w-6 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="mr-2 hidden select-none items-center gap-0.5 rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 sm:inline-flex">
            <span className="text-[11px]">⌘</span>K
          </kbd>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          id="search-listbox"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-lg"
        >
          {isFetching && results.length === 0 && (
            <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-neutral-500">
              <Loader2 size={14} className="animate-spin" />
              Searching…
            </div>
          )}

          {!isFetching && results.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-neutral-700">
                No results for “{debounced}”
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Try a different keyword or check the spelling.
              </p>
            </div>
          )}

          {results.length > 0 && (
            <>
              <p className="border-b border-neutral-100 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                Products
              </p>
              <ul className="py-1">
                {results.map((item, index) => {
                  const thumb =
                    item?.variants?.[0]?.thumbnail || "/api/placeholder/48/48";
                  const active = highlight === index;
                  return (
                    <li key={item._id} role="option" aria-selected={active}>
                      <button
                        type="button"
                        onMouseEnter={() => setHighlight(index)}
                        onClick={() => handleSelect(item)}
                        className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                          active ? "bg-neutral-100" : "hover:bg-neutral-50"
                        }`}
                      >
                        <img
                          src={thumb}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-md object-cover"
                          loading="lazy"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-neutral-900">
                            {item.productName}
                          </p>
                          <p className="truncate text-xs text-neutral-500">
                            {item.brand || item.categoryId?.categoryName || "—"}
                          </p>
                        </div>
                        {item.price != null && (
                          <span className="shrink-0 text-sm font-medium text-neutral-900 tabular-nums">
                            ₹
                            {(
                              item.discountPrice || item.price
                            ).toLocaleString("en-IN")}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={() => {
                  navigate(`/products?q=${encodeURIComponent(debounced)}`);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-center border-t border-neutral-100 px-4 py-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                See all results for “{debounced}”
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;