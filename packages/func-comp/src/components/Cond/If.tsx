export type IfProps = {
    expr: boolean;
    children: React.ReactNode;
};

export default function If({ children }: IfProps) {
    return children;
}
