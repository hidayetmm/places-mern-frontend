import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Col,
  Title,
  Text,
  Anchor,
  ActionIcon,
  Image,
  Group,
  Box,
} from "@mantine/core";
import FacebookIcon from "./icons/facebook.svg";
import TwitterIcon from "./icons/twitter.svg";
import InstagramIcon from "./icons/instagram.svg";

const Footer = () => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.colors.gray[1],
      })}
    >
      <Container className="footer" size="xl">
        <Grid>
          <Col span={3}>
            <Title order={4}>Navigation</Title>
            <Anchor
              variant="text"
              sx={(theme) => ({
                "&:hover": {
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[1]
                      : theme.colors.gray[6],
                },
              })}
              component={Link}
              to="about"
            >
              Home
            </Anchor>
            <Anchor
              variant="text"
              sx={(theme) => ({
                "&:hover": {
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[1]
                      : theme.colors.gray[6],
                },
              })}
              component={Link}
              to="profile"
            >
              Account
            </Anchor>
            <Anchor
              variant="text"
              sx={(theme) => ({
                "&:hover": {
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[1]
                      : theme.colors.gray[6],
                },
              })}
              component={Link}
              to="about"
            >
              Logout
            </Anchor>
          </Col>
          <Col span={3}>
            <Title order={4}>Information</Title>
            <Anchor
              variant="text"
              sx={(theme) => ({
                "&:hover": {
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[1]
                      : theme.colors.gray[6],
                },
              })}
              component={Link}
              to="about"
            >
              About Us
            </Anchor>
            <Anchor
              variant="text"
              sx={(theme) => ({
                "&:hover": {
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[1]
                      : theme.colors.gray[6],
                },
              })}
              component={Link}
              to="about"
            >
              Blog
            </Anchor>
            <Anchor
              variant="text"
              sx={(theme) => ({
                "&:hover": {
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[1]
                      : theme.colors.gray[6],
                },
              })}
              component={Link}
              to="about"
            >
              Events
            </Anchor>
            <Anchor
              variant="text"
              sx={(theme) => ({
                "&:hover": {
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[1]
                      : theme.colors.gray[6],
                },
              })}
              component={Link}
              to="about"
            >
              Privacy Policy
            </Anchor>
          </Col>
          <Col span={3}>
            <Title order={4}>Help</Title>
            <Anchor
              variant="text"
              sx={(theme) => ({
                "&:hover": {
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[1]
                      : theme.colors.gray[6],
                },
              })}
              component={Link}
              to="about"
            >
              Help Center
            </Anchor>
            <Anchor
              variant="text"
              sx={(theme) => ({
                "&:hover": {
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[1]
                      : theme.colors.gray[6],
                },
              })}
              component={Link}
              to="about"
            >
              Get Started
            </Anchor>
            <Anchor
              variant="text"
              sx={(theme) => ({
                "&:hover": {
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[1]
                      : theme.colors.gray[6],
                },
              })}
              component={Link}
              to="about"
            >
              Contact Us
            </Anchor>
          </Col>
          <Col span={3}>
            <Title order={4}>Connect</Title>
            <Text>M. F. Axundov Kuc. 164 AZ1000</Text>
            <Text>Absheron, Baku</Text>
            <Text>+994 12 4368479</Text>
            <Group style={{ paddingTop: 10 }}>
              <ActionIcon variant="filled">
                <Image src={FacebookIcon} />
              </ActionIcon>
              <ActionIcon variant="filled">
                <Image src={InstagramIcon} />
              </ActionIcon>
              <ActionIcon variant="filled">
                <Image src={TwitterIcon} />
              </ActionIcon>
            </Group>
          </Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
