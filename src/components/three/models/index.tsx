import type { ComponentType } from "react";
import AboutCube from "@/components/three/models/AboutCube";
import AssemblingCube from "@/components/three/models/AssemblingCube";
import BrandCube from "@/components/three/models/BrandCube";
import DeviceFrame from "@/components/three/models/DeviceFrame";
import DriftingCube from "@/components/three/models/DriftingCube";
import Folders from "@/components/three/models/Folders";
import Funnel from "@/components/three/models/Funnel";
import GlassBrowser from "@/components/three/models/GlassBrowser";
import HandsetRings from "@/components/three/models/HandsetRings";
import type { ModelKey, ModelProps } from "@/components/three/models/keys";
import { LegalDocument, Shield } from "@/components/three/models/LegalModels";
import NodeGraph from "@/components/three/models/NodeGraph";
import PaperPlane from "@/components/three/models/PaperPlane";
import PhoneBubbles from "@/components/three/models/PhoneBubbles";
import PhoneScreens from "@/components/three/models/PhoneScreens";
import ProcessPath from "@/components/three/models/ProcessPath";
import ServerHub from "@/components/three/models/ServerHub";
import ServicesTurntable from "@/components/three/models/ServicesTurntable";

function FoldersOpen() {
  return <Folders />;
}

function FoldersClosed() {
  return <Folders closed />;
}

/** Every page model by name. Part of the 3D chunk: only ModelCanvas imports it. */
export const MODELS: Record<ModelKey, ComponentType<ModelProps>> = {
  "brand-cube": BrandCube,
  "glass-browser": GlassBrowser,
  "phone-screens": PhoneScreens,
  "node-graph": NodeGraph,
  "phone-bubbles": PhoneBubbles,
  "handset-rings": HandsetRings,
  funnel: Funnel,
  "server-hub": ServerHub,
  "services-turntable": ServicesTurntable,
  "process-path": ProcessPath,
  "about-cube": AboutCube,
  folders: FoldersOpen,
  "folders-closed": FoldersClosed,
  "device-frame": DeviceFrame,
  "paper-plane": PaperPlane,
  "assembling-cube": AssemblingCube,
  shield: Shield,
  "legal-document": LegalDocument,
  "drifting-cube": DriftingCube,
};
