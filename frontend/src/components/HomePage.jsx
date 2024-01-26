import config from "../config.js";
import {useQuery} from "@tanstack/react-query";


function HomeWrapper({children}) {
    return (
        <div>
            <div className="home-container">
                <h1>Stock King</h1>
                <button data-testid="hello-world">Hello World!</button>
                {children}
            </div>
        </div>
    )
}

export default function HomePage() {
    const { isPending, error, data } = useQuery({
        queryKey: ['lorem_ipsum'],
        queryFn: () =>
            fetch(`${config.baseUri}/lorem_ipsum`).then((res) =>
                res.json(),
            ),
    });

    if (isPending) {
        return (
            <HomeWrapper>
                <p>Loading...</p>
            </HomeWrapper>
        )
    }

    if (error) {
        return (
            <HomeWrapper>
                <p>Error has occurred</p>
            </HomeWrapper>
        );
    }

    return (
        <HomeWrapper>
            <p className="lorem-ipsum">{data.message}</p>
        </HomeWrapper>
    )
}