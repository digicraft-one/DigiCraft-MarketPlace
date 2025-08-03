import CredentialsProvider from "next-auth/providers/credentials";

const credentialsProvider = CredentialsProvider({
    id: "credentials",
    name: "credentials",

    credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
    },

    async authorize(credentials) {
        const { username, password } = credentials ?? {};

        if (!username || !password)
            throw new Error("Please provide both username and password");

        if (
            username === process.env.ADMIN_USERNAME &&
            password === process.env.ADMIN_PASSWORD
        )
            return { id: "1", name: "Admin", username: username };

        return null;
    },
});

export default credentialsProvider;
