import "/node_modules/flag-icons/css/flag-icons.min.css";

export default function FlagIcon({code}) {
    return <span className={`fi fi-${code}`}></span>;
}
