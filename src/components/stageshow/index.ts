// The parts of the stageshow kit the site uses, imported from their own
// modules rather than kit/index.ts, so only their CSS ships (the kit's
// phones, keyboards and message threads stay out of the bundle).
export { Stage } from "./kit/stage";
export { useReducedMotion } from "./kit/reduced-motion";
export type { Act } from "./kit/act";
export type { Layout } from "./kit/looks";
export type { Point, Rect } from "./kit/measure";

export { Window, Bar, Text } from "./kit/window";

export { Collapse } from "./kit/motion/Collapse";
export { Count } from "./kit/motion/Count";
export { Roll } from "./kit/motion/Roll";
export { Popover } from "./kit/motion/Popover";
export { States } from "./kit/motion/States";
export { Swap } from "./kit/motion/Swap";
export { Connector } from "./kit/motion/Connector";

export { Row } from "./kit/parts/Row";
export { Spinner } from "./kit/parts/Spinner";
export { Meter } from "./kit/parts/Meter";
export { Chip } from "./kit/parts/Chip";

export { Badge } from "./kit/controls/Badge";
export { Button } from "./kit/controls/Button";
export { Field } from "./kit/controls/Field";
export { Segmented } from "./kit/controls/Segmented";

export { Chart, chartPoints } from "./kit/chart";
export { Code } from "./kit/code";
