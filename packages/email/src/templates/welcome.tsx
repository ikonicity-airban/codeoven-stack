import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

export function WelcomeEmail({
  name = "there",
  url = "http://localhost:3000",
}: {
  name?: string;
  url?: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Welcome aboard</Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif", background: "#f6f7f9" }}>
        <Container
          style={{
            background: "#fff",
            padding: 32,
            borderRadius: 8,
            margin: "24px auto",
            maxWidth: 480,
          }}
        >
          <Heading as="h1">Welcome, {name}!</Heading>
          <Text>Your account is ready. Click below to get started.</Text>
          <Button
            href={url}
            style={{ background: "#111", color: "#fff", padding: "12px 20px", borderRadius: 6 }}
          >
            Open dashboard
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
export default WelcomeEmail;
