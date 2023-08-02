import type { Meta, StoryObj } from "@storybook/react";
import { Global, css } from "@emotion/react";
import {
  ThemeProvider,
  SidebarCard,
  ButtonCard,
  Row,
  RoomCard,
  Group,
  Column,
  SceneCard,
} from "@components";
import {
  Source,
} from "@storybook/blocks";
import { useEntity } from '@hakit/core';
// @ts-expect-error - Don't have types for jsx-to-string
import jsxToString from "jsx-to-string";
import type { SidebarCardProps } from "@components";
import { HassConnect } from "@stories/HassConnectFake";
import office from "../RoomCard/office.jpg";
import livingRoom from "../RoomCard/living-room.jpg";

function Template(args?: Partial<SidebarCardProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Row
        alignItems="stretch"
        justifyContent="flex-start"
        fullWidth
        fullHeight
        wrap="nowrap"
      >
        <SidebarCard {...args}>
          <p>You can insert any children in the sidebar here</p>
        </SidebarCard>
        <Row fullWidth fullHeight gap="0.5rem">
          <RoomCard
            hash="office"
            image={office}
            title="Office"
            icon="mdi:office-chair"
          >
            <Column gap="1rem">
              <Group title="Striplights">
                <ButtonCard entity="light.fake_light" service="toggle" />
                <ButtonCard entity="light.fake_light" service="toggle" />
                <ButtonCard entity="light.fake_light" service="toggle" />
                <ButtonCard entity="light.fake_light" service="toggle" />
              </Group>
              <SceneCard entity="scene.good_morning" data-testid="scene-card" />
              <Group title="Downlights">
                <ButtonCard entity="light.fake_light" service="toggle" />
                <ButtonCard entity="light.fake_light" service="toggle" />
              </Group>
            </Column>
          </RoomCard>
          <RoomCard
            hash="living-room"
            image={livingRoom}
            title="Living Room"
            icon="mdi:sofa"
          >
            <div>LivingRoom</div>
          </RoomCard>
        </Row>
      </Row>
    </HassConnect>
  );
}

import { Icon } from "@iconify/react";

function SidebarMenuItems(args?: Partial<SidebarCardProps>) {
  const ac = useEntity('climate.air_conditioner');
  return <SidebarCard {...args} menuItems={([
    {
      title: "Air Conditioner",
      description: ac.state !== 'off' ? `${ac.state} - currently ${ac.attributes.temperature}°` : 'Not running',
      icon: ac.state !== 'off' ? <Row>
        <Icon icon={'mdi:fan'} className="spin" />
        <Icon style={{
          marginLeft: 10
        }} icon={'mdi:arrow-up'} onClick={(event) => {
          event.stopPropagation();
          ac.api.setTemperature({
            hvac_mode: 'cool',
            temperature: ac.attributes.temperature + 1
          });
        }}/>
        <Icon icon={'mdi:arrow-down'} onClick={(event) => {
          event.stopPropagation();
          ac.api.setTemperature({
            hvac_mode: 'cool',
            temperature: ac.attributes.temperature - 1
          });
        }}/>
      </Row> : 'mdi-power',
      active: ac.state !== 'off',
      onClick(event) {
        event.stopPropagation();
        if (ac.state === 'off') {
          ac.api.turnOn();
        } else {
          ac.api.turnOff();
        }
      },
    },
  ])}>
    <p>You can insert any children in the sidebar here</p>
    <Global styles={css`
      @keyframes spin {
        from {
            transform:rotate(0deg);
        }
        to {
            transform:rotate(360deg);
        }
      }
      .spin {
        animation-name: spin;
        animation-duration: 5000ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear; 
      }
    `} />
  </SidebarCard>;
}

function Replica() {
  return `<SidebarCard menuItems={[
    {
      title: "Air Conditioner",
      description: ac.state !== 'off' ? \`\${ac.state} - currently \${ac.attributes.temperature}°\` : 'Not running',
      icon: ac.state !== 'off' ? <Row>
        <Icon icon={'mdi:fan'} className="spin" />
        <Icon style={{
          marginLeft: 10
        }} icon={'mdi:arrow-up'} onClick={(event) => {
          event.stopPropagation();
          ac.api.setTemperature({
            hvac_mode: 'cool',
            temperature: ac.attributes.temperature + 1
          });
        }}/>
        <Icon icon={'mdi:arrow-down'} onClick={(event) => {
          event.stopPropagation();
          ac.api.setTemperature({
            hvac_mode: 'cool',
            temperature: ac.attributes.temperature - 1
          });
        }}/>
      </Row> : 'mdi-power',
      active: ac.state !== 'off',
      onClick(event) {
        event.stopPropagation();
        if (ac.state === 'off') {
          ac.api.turnOn();
        } else {
          ac.api.turnOff();
        }
      },
    },
  ]} />`
}

function TemplateMenuItems(args?: Partial<SidebarCardProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Row
        alignItems="stretch"
        justifyContent="flex-start"
        fullWidth
        fullHeight
        wrap="nowrap"
      >
        <SidebarMenuItems {...args} />
        <Row fullWidth fullHeight gap="0.5rem">
          <p style={{
            maxWidth: 600
          }}>This is just an example of the level of customization achievable, this isn't fully implemented as you will see when you collapse this sidebar!</p>
          <Source
            dark
            code={Replica()}
          />
        </Row>
      </Row>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/SidebarCard",
  component: SidebarCard,
  tags: ["autodocs"],
  parameters: {
    width: "100%",
    height: "100%",
    padding: 0,
  },
  argTypes: {},
} satisfies Meta<typeof SidebarCard>;
export type SidebarStory = StoryObj<typeof SidebarCard>;
export const SidebarExample: SidebarStory = {
  render: Template,
  args: {
    menuItems: [
      {
        title: "Air Conditioner",
        description: "On - currently 23°",
        icon: "mdi:fan",
        active: false,
        onClick() {
          console.log("do something on click!");
        },
      },
    ],
    weatherCardProps: {
      entity: "weather.entity",
      includeForecast: true,
    },
  },
};


export const CustomMenuItemsExample: SidebarStory = {
  render: TemplateMenuItems,
  args: {
    weatherCardProps: {
      entity: "weather.entity",
      includeForecast: true,
    },
  },
};