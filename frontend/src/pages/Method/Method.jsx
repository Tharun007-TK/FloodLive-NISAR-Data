import React from 'react';
import { BookOpen, Layers, Radio, Shield, AlertTriangle, Compass, CheckCircle2, Database, ExternalLink } from 'lucide-react';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function Method() {
  const datasets = [
    {
      name: 'NISAR L2 GCOV (PROVISIONAL)',
      provider: 'NASA / ISRO via Alaska Satellite Facility (ASF) DAAC',
      frequency: 'L-band (1.25 GHz, 24 cm wavelength)',
      resolution: '10 m geocoded grid (frequencyA)',
      license: 'NASA Open Data Policy (Public Domain)',
      citation: 'NISAR Science Team (2026). NISAR Level 2 Geocoded Covariance (GCOV) Provisional Product. ASF DAAC.'
    },
    {
      name: 'Copernicus DEM GLO-30',
      provider: 'European Space Agency (ESA) / Airbus',
      frequency: 'Topographic elevation & slope',
      resolution: '30 m spatial resolution',
      license: 'Copernicus Open Access Free & Open License',
      citation: 'ESA (2021). Copernicus Global Digital Elevation Model (GLO-30). European Space Agency.'
    },
    {
      name: 'ESA WorldCover 2021 v200',
      provider: 'European Space Agency / VITO Remote Sensing',
      frequency: 'Global 11-class land cover map',
      resolution: '10 m spatial resolution',
      license: 'Creative Commons Attribution 4.0 International (CC-BY 4.0)',
      citation: 'Zanaga, D., et al. (2022). ESA WorldCover 10 m 2021 v200. European Space Agency.'
    },
    {
      name: 'Global Human Settlement Layer (GHSL) / WorldPop',
      provider: 'European Commission JRC / University of Southampton',
      frequency: 'Gridded residential population estimates',
      resolution: '100 m / 1 km gridded surface',
      license: 'Open Data Commons Open Database License (ODbL) / CC-BY 4.0',
      citation: 'WorldPop & JRC (2025). High Resolution Population Density Model. Tagged as modelled estimate.'
    },
    {
      name: 'Administrative Boundaries (GADM / geoBoundaries)',
      provider: 'William & Mary geoBoundaries / GADM project',
      frequency: 'District and state administrative polygons (ADM2)',
      resolution: 'Sub-district vector boundaries',
      license: 'CC-BY 4.0 / Academic Open Data',
      citation: 'Runfola, D. et al. (2020). geoBoundaries: A global database of political administrative boundaries. PLoS ONE.'
    },
    {
      name: 'NASA GPM IMERG Final Precipitation (GPM_3IMERGDF)',
      provider: 'NASA Goddard Earth Sciences DISC',
      frequency: 'Multi-satellite precipitation estimates',
      resolution: '0.1° daily aggregated rainfall',
      license: 'NASA Open Data Policy',
      citation: 'Huffman, G.J. et al. (2019). GPM IMERG Final Precipitation L3 1 day 0.1 degree. NASA GES DISC.'
    }
  ];

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <DisclaimerBanner
        message="Scientific Methodology Documentation • All parameters and thresholds are reproducible config values • No magic constants"
      />

      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Algorithm Specification & Validation Standard
          </span>
        </div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
          Scientific Processing Methodology
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 'var(--space-1) 0 0 0', lineHeight: 1.6 }}>
          End-to-end algorithmic derivation of surface water extent, flooded vegetation, and multi-sector exposure from NISAR L-band SAR observations.
        </p>
      </div>

      {/* Section 1: Algorithmic Architecture */}
      <section style={{ backgroundColor: 'var(--surface-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', marginTop: 0, marginBottom: 'var(--space-3)' }}>
          1. Sensor Physics & Radiometric Calibration
        </h2>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 var(--space-3) 0' }}>
          NISAR is a dual-frequency L-band (1.25 GHz, 24 cm) and S-band (3.2 GHz, 9.3 cm) satellite launched in July 2025. 
          The public science observations distributed by the Alaska Satellite Facility (ASF) DAAC are L-band Level-2 Geocoded Covariance (GCOV) matrices. 
          Dual-pol acquisitions in the Indian subcontinent operate in mode code <code className="font-mono">4005_DHDH</code> with diagonal power terms:
        </p>
        <div style={{ backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)', fontFamily: 'monospace', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)', overflowX: 'auto' }}>
          gamma0_HV_dB = 10.0 * log10(max(HVHV_linear_power, 1e-7))
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Radiometric terrain-corrected backscatter is read directly from <code className="font-mono">/science/LSAR/GCOV/grids/frequencyA/HVHV</code>. 
          The accompanying valid data mask layer (<code className="font-mono">mask == 0</code>) is enforced to exclude non-valid pixels and edge padding.
        </p>
      </section>

      {/* Section 2: Automated Otsu Thresholding */}
      <section style={{ backgroundColor: 'var(--surface-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', marginTop: 0, marginBottom: 'var(--space-3)' }}>
          2. Automated Otsu Thresholding & Bitemporal Difference
        </h2>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 var(--space-3) 0' }}>
          Open standing water behaves as a specular reflector at microwave wavelengths, reflecting emitted radar pulses forward and returning very low backscatter (typically below -18 dB to -22 dB). 
          Rather than relying on arbitrary hardcoded constants, the optimal water classification threshold is determined using Otsu’s method:
        </p>
        <div style={{ backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)', fontFamily: 'monospace', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)' }}>
          sigma_b^2(t) = w0(t) * w1(t) * [mu0(t) - mu1(t)]^2
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 var(--space-3) 0' }}>
          Where <code className="font-mono">t</code> maximizes between-class variance over the AOI backscatter histogram. 
          To protect against single-image false positives, a bitemporal change detection criterion is applied between the pre-flood baseline and the post-flood acquisition:
        </p>
        <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, paddingLeft: 'var(--space-5)' }}>
          <li><strong>Specular water threshold:</strong> <code className="font-mono">HV_post_dB &lt;= T_otsu</code> (physically bounded between -24.0 dB and -16.0 dB).</li>
          <li><strong>Bitemporal change constraint:</strong> <code className="font-mono">delta_HV_dB &lt;= -4.5 dB</code> (confirms a sharp drop in backscatter relative to the pre-flood reference).</li>
        </ul>
      </section>

      {/* Section 3: L-Band Double Bounce in Flooded Vegetation */}
      <section style={{ backgroundColor: 'var(--surface-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', marginTop: 0, marginBottom: 'var(--space-3)' }}>
          3. Dihedral Double-Bounce Detection in Submerged Vegetation
        </h2>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 var(--space-3) 0' }}>
          A well-known limitation of conventional SAR water detection algorithms is that flooded vegetation <strong>does not appear dark</strong>. 
          At L-band (24 cm wavelength), radar waves penetrate forest canopies and crop foliage. 
          When standing water collects beneath trees or tall crops, the smooth water surface and vertical stems create an orthogonal dihedral corner reflector. 
          This results in a dramatic <em>increase</em> in backscatter (+3 dB to +6 dB) rather than attenuation.
        </p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          This observatory explicitly isolates this phenomenon using the criterion:
          <code className="font-mono" style={{ display: 'block', margin: 'var(--space-2) 0', padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-xs)' }}>
            delta_HV_dB &gt;= +3.0 dB AND land_cover IN (Cropland, Shrub, Forest)
          </code>
          Flooded vegetation is preserved and served as an independent analyst layer rather than being silently omitted.
        </p>
      </section>

      {/* Section 4: Topographic and Hydrologic Corrections */}
      <section style={{ backgroundColor: 'var(--surface-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', marginTop: 0, marginBottom: 'var(--space-3)' }}>
          4. Topographic Masking & Equal-Area Geodesic Metrics
        </h2>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 var(--space-3) 0' }}>
          Radar side-looking geometry creates geometric layover and shadow artifacts on steep slopes. 
          To prevent false positive flood classification in mountainous terrain, Copernicus DEM GLO-30 (30m) is ingested, and topographic slope gradient is computed:
        </p>
        <div style={{ backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)', fontFamily: 'monospace', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)' }}>
          slope_degrees &gt; 5.0 deg ==&gt; Masked (Implausible flooding relief)
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 var(--space-3) 0' }}>
          <strong>Perennial water subtraction:</strong> Permanent river channels, oxbow lakes, and reservoirs are subtracted so that reported extents represent strictly <em>episodic inundation expansion</em>.
        </p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          <strong>Minimum mapping unit & equal-area projection:</strong> Isolated clusters smaller than 1.0 hectare (10,000 m²) are removed to suppress radar speckle. 
          Polygons are projected to Cylindrical Equal-Area (<code className="font-mono">EPSG:6933</code>) for mathematically exact geodesic area computation, 
          eliminating the latitude distortion inherent in degree approximations (<code className="font-mono">g.area * 111^2</code>).
        </p>
      </section>

      {/* Section 5: Known Limitations & Caveats */}
      <section style={{ backgroundColor: 'var(--surface-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          <AlertTriangle size={18} color="var(--status-warning)" />
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Known Physical Limitations
          </h2>
        </div>
        <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, paddingLeft: 'var(--space-5)' }}>
          <li><strong>Wind-roughened surface water:</strong> High surface wind speeds (&gt; 7 m/s) generate capillary waves on broad water bodies, increasing Bragg scattering and raising backscatter above the water threshold.</li>
          <li><strong>Urban corner reflection:</strong> Multi-story masonry buildings and concrete structures produce severe double-bounce reflection, preventing detection of flooded streets in dense urban areas.</li>
          <li><strong>12-day orbital revisit:</strong> NISAR’s exact repeat interval is 12 days. Flash floods with durations under 48 hours that occur between orbital overpasses cannot be captured.</li>
          <li><strong>Provisional calibration state:</strong> Public L-band GCOV granules acquired prior to final post-commissioning cross-calibration are marked PROVISIONAL. Reprocessing is scheduled through late 2026.</li>
        </ul>
      </section>

      {/* Section 6: Provenance & Licensing Matrix */}
      <section style={{ backgroundColor: 'var(--surface-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', marginTop: 0, marginBottom: 'var(--space-3)' }}>
          5. Dataset Provenance, Versions & Licensing Matrix
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-subtle)', borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '8px 10px' }}>Dataset</th>
                <th style={{ padding: '8px 10px' }}>Provider & Frequency</th>
                <th style={{ padding: '8px 10px' }}>Resolution</th>
                <th style={{ padding: '8px 10px' }}>License</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((d, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>{d.name}</td>
                  <td style={{ padding: '8px 10px', color: 'var(--text-secondary)' }}>{d.provider} ({d.frequency})</td>
                  <td className="font-mono" style={{ padding: '8px 10px', color: 'var(--accent-blue)' }}>{d.resolution}</td>
                  <td style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>{d.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
