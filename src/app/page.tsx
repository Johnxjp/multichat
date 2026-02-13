import { SettingsPanel } from "@/components/SettingsPanel";
import { PanelArea } from "@/components/PanelArea";

export default function Home() {
  return (
    <div className="flex h-screen">
      <SettingsPanel />
      <PanelArea />
    </div>
  );
}
