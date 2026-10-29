import { postRoute } from "@/lib/post-route";

const route = postRoute(["articles", "notes"]);
export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
