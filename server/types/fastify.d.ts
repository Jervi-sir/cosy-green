import "@fastify/jwt";
import "@fastify/sensible";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      role: "USER" | "TRUCK";
      truckId: string | null;
    };
    user: {
      sub: string;
      role: "USER" | "TRUCK";
      truckId: string | null;
    };
  }
}
