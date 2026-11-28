// Monogramme de la marque dans la barre du studio, couleur du texte du studio. Il vient du point d'entrée léger du
// paquet (D-126) : la CLI Sanity (extraction du schéma, types) ne peut pas charger les composants.
import { LOGO_MARK_SVG } from '@fhaaabile/fm-design-system/data';

export function StudioLogo() {
  return <span aria-hidden style={{ display: 'inline-flex', width: 24, height: 24 }} dangerouslySetInnerHTML={{ __html: LOGO_MARK_SVG.replace('<svg ', '<svg width="24" height="24" ') }} />;
}
