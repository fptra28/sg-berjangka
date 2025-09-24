interface MiniHeaderProps {
    title: string;
}

export default function MiniHeader(props: MiniHeaderProps) {
    return (
        <div className="px-5 py-2 uppercase font-bold text-yellow-500 rounded bg-neutral-800 w-fit">
            <h2>{props.title}</h2>
        </div>
    );
}