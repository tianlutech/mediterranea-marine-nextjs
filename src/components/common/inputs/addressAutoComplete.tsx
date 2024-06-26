import { Combobox } from "@headlessui/react";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  setLatLng: (position: { lat: number; lng: number, address: string }) => void;
  placeholder?: string;
};

export default function PlaceAutoComplete({ setLatLng, placeholder }: Props) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (val: string) => {
    setValue(val, false);
    clearSuggestions();

    const results = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(results[0] as any);
    setLatLng({ lat, lng, address: val });
  };

  return (
    <Combobox as="div" onChange={handleSelect}>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full border md:text-sm text-xs border-gray-300 text-black text-start p-[0.7rem] md:px-8 px-4 rounded-lg"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          placeholder={placeholder || ""}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"></Combobox.Button>
        {status === "OK" && (
          <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1  ring-opacity-5 focus:outline-none sm:text-sm ">
            {data.map(({ place_id, description }) => (
              <Combobox.Option
                key={place_id}
                value={description}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-gray-300 text-gray-900" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected && "font-semibold"
                      )}
                    >
                      {description}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-brand"
                        )}
                      ></span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
