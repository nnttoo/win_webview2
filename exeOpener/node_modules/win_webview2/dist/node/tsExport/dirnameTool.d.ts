/**
 *
 * Penting!! jangan pindah file ini ketempat lain,
 * Sesuaikan ulang jika file ini dipindah karena ini menggunakan __dirname
 * dan juga file ini akan ditranspile ke js ke folder Dist, posisi file ini terhadap root antara file ts dan
 * file js harus sama,
 *
 */
export declare function getWw2Dirname(): {
    _dirname: string;
    _filename: string;
    ww2ModulePath: string;
};
export declare function findUserProjectRoot(currentDir?: string): string | null;
