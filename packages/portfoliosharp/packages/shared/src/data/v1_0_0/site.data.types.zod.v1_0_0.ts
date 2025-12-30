import { z } from 'zod';

// ---- Base Types ----
const TimeSchema = z.object({
    hours: z.number(),
    minutes: z.number().optional(),
});

const DateClassSchema = z.object({
    year: z.number().optional(),
    month: z.union([z.number(), z.string()]),
    day: z.number(),
    hours: z.number().optional(),
    minutes: z.number().optional(),
    seconds: z.number().optional(),
    milliSeconds: z.number().optional(),
});

// ---- Position & Location ----
const PositionSchema = z.object({
    latitude: z.string(),
    longitude: z.string(),
});

const LocationKeySchema = z.object({
    locationKey: z.string(),
    permanentlyClosedDate: z.string().optional(),
});

const LocationSchema = z.object({
    key: z.string(),
    name: z.string(),
    address: z.string(),
    countryCode: z.string(),
    position: PositionSchema,
});

// ---- Organization ----
const OrganizationSchema = z.object({
    key: z.string(),
    name: z.string(),
    nameLong: z.string(),
    url: z.string().optional(),
    logoUrl: z.string().optional(),
    logoBackgroundColor: z.string().optional(),
    nonProfit: z.boolean(),
    communityDriven: z.boolean(),
    locationsKeys: z.record(z.string(), LocationKeySchema).optional(),
    isPerson: z.boolean().optional(),
});

// ---- CustomFunction ----
const CustomFunctionSchema = z.object({
    name: z.string(),
    nameInternal: z.string().optional(),
    arguments: z.string(),
    body: z.string(),
    canBeCalledFromOtherFunctions: z.boolean().optional(),
});

// ---- Function Context Types ----
const FunctionContextOnlySchema = z.object({
    context: z.string(),
});

const CustomFunctionsWithContextSchema = FunctionContextOnlySchema.extend({
    functions: z.array(CustomFunctionSchema),
});

// ---- SocialLink & InfoCard ----
const SocialLinkSchema = z.object({
    iconUrl: z.string(),
    platform: z.string(),
    url: z.string(),
});

const InfoCardSchema = z.object({
    imageUrl: z.string(),
    title: z.string(),
    hint: z.union([z.string(), z.null()]),
    textLines: z.array(z.string()),
});

// ---- Profile & Image ----
const ImageSchema = z.object({
    url: z.string(),
    description: z.string(),
    isMainImage: z.boolean(),
});

const ProfileSchema = z.object({
    fullName: z.string(),
    description: z.string(),
    images: z.array(ImageSchema),
});

// ---- Process ----
const GettingStartedSchema = z.object({
    description: z.string(),
    steps: z.array(z.string()),
});

const ProcessSchema = z.object({
    gettingStarted: GettingStartedSchema,
    softwareDevelopmentLifecycle: GettingStartedSchema,
});

// ---- Holiday / Rest / Leave Types ----
const HolidayRestAndLeaveEntryEntryApplicableOnlyForSchema = z.object({
    months: z.string().optional(),
    years: z.string().optional(),
});

const HolidayRestAndLeaveEntryEntryStartAndEndDatesSchema = z.object({
    name: z.string().optional(),
    date: DateClassSchema.optional(),
    startDate: DateClassSchema.optional(),
    endDate: DateClassSchema.optional(),
    timeZone: z.string().optional(),
    applicableOnlyFor: HolidayRestAndLeaveEntryEntryApplicableOnlyForSchema.optional(),
});

const HolidayRestAndLeaveEntryEntrySchema = HolidayRestAndLeaveEntryEntryStartAndEndDatesSchema.extend({
    multiple: z.array(HolidayRestAndLeaveEntryEntryStartAndEndDatesSchema).optional(),
    isSick: z.boolean().optional(),
});

const DateResultOffsetSchema = z.object({
    days: z.number().optional(),
    hours: z.number().optional(),
    minutes: z.number().optional(),
});

const HolidayRestAndLeaveEntryEntryByFunctionsFunctionRunSchema = z.object({
    name: z.string().optional(),
    functionName: z.string(),
    timeZone: z.string().optional(),
    dateResultOffset: DateResultOffsetSchema.optional(),
    startDateResultOffset: DateResultOffsetSchema.optional(),
    endDateResultOffset: DateResultOffsetSchema.optional(),
    applicableOnlyFor: HolidayRestAndLeaveEntryEntryApplicableOnlyForSchema.optional(),
});

const HolidayRestAndLeaveEntryEntryByFunctionsSchema = HolidayRestAndLeaveEntryEntryByFunctionsFunctionRunSchema.extend({
    multiple: z.array(HolidayRestAndLeaveEntryEntryByFunctionsFunctionRunSchema).optional(),
});

const DefaultSleepTimeSchema = z.object({
    startTime: TimeSchema,
    endTime: TimeSchema,
});

const HolidaysRestAndLeaveEntrySchema = z.object({
    key: z.string(),
    type: z.enum(['publicNational', 'school', 'workLeave', 'break']),
    timeZone: z.string(),
    functions: z.union([z.array(CustomFunctionSchema), z.undefined()]),
    entries: z.array(
        z.discriminatedUnion('multiple', [
            HolidayRestAndLeaveEntryEntrySchema,
            HolidayRestAndLeaveEntryEntryByFunctionsSchema,
        ])
    ),
    dependsOnType: z.string().optional(),
    defaultSleepTime: DefaultSleepTimeSchema.optional(),
});

// ---- Experience Grade Level, WorkModel, Role, etc. ----
const ExperienceGradeLevelSchema = z.object({
    level: z.number(),
    name: z.string(),
    description: z.string(),
});

const WorkModelSchema = z.object({
    key: z.string(),
    name: z.string(),
    description: z.string(),
});

const RoleSchema = z.object({
    key: z.string(),
    name: z.string(),
    description: z.string(),
    children: z.lazy((): z.ZodType<any> => z.array(RoleSchema)).optional(),
});

const TechnologyTypeSchema = z.object({
    key: z.string(),
    name: z.string(),
    description: z.string(),
    children: z.lazy((): z.ZodType<any> => z.array(TechnologyTypeSchema)).optional(),
});

const SectorSchema = z.object({
    key: z.string(),
    name: z.string(),
    description: z.string(),
});

const ProjectMotiveSchema = z.object({
    key: z.string(),
    name: z.string(),
    description: z.string(),
});

const ProjectTagSchema = z.object({
    key: z.string(),
    name: z.string(),
    description: z.string(),
});

const ProjectActionTagSchema = z.object({
    key: z.string(),
    name: z.string(),
    description: z.string(),
});

const ConceptSchema = z.object({
    key: z.string(),
    name: z.string(),
    description: z.string(),
    experienceGradeLevel: z.number(),
    children: z.lazy((): z.ZodType<any> => z.array(ConceptSchema)).optional(),
});

// ---- TimingSchedule & Time Slices ----
const BreakSchema = z.object({
    startBreakTime: TimeSchema,
    breakDurationMinutes: z.number(),
});

const DaySchema = z.object({
    startTime: TimeSchema,
    endTime: TimeSchema,
    breaks: z.array(BreakSchema).optional(),
});

const DaysScheduleSchema = z.object({
    applicableInMonths: z.array(z.union([z.number(), z.string()])).optional(),
    weekDays: z.record(z.string(), DaySchema),
});

const WeeklyScheduleApplicableSchema = z.object({
    applicableFromDate: z.string(),
    applicableToDate: z.string().optional(),
    timeZone: z.string().optional(),
    daysSchedules: z.array(DaysScheduleSchema),
});

const MonthlyScheduleApplicableSchema = z.object({
    applicableFromDate: z.string(),
    applicableToDate: z.string().optional(),
    timeZone: z.string().optional(),
    startOfMonth: z.boolean().optional(),
    endOfMonth: z.boolean().optional(),
    splitOntoDaysMinimum: z.number().optional(),
    specificDaysOfMonth: z.array(z.number()).optional(),
});

const YearlyScheduleApplicableSchema = z.object({
    applicableFromDate: z.string(),
    applicableToDate: z.string().optional(),
    timeZone: z.string().optional(),
    startOfYear: z.boolean().optional(),
    endOfYear: z.boolean().optional(),
    meteorologicalWinter: z.union([z.boolean(), z.number()]).optional(),
    meteorologicalSpring: z.union([z.boolean(), z.number()]).optional(),
    meteorologicalSummer: z.union([z.boolean(), z.number()]).optional(),
    meteorologicalAutumn: z.union([z.boolean(), z.number()]).optional(),
});

const TimeSliceSchema = z.object({
    key: z.string(),
    weeklyScheduleApplicable: z.array(WeeklyScheduleApplicableSchema).optional(),
    monthlyScheduleApplicable: z.array(MonthlyScheduleApplicableSchema).optional(),
    yearlyScheduleApplicable: z.array(YearlyScheduleApplicableSchema).optional(),
});

const OnCallExceptionSchema = z.object({
    startDate: z.string(),
    endDate: z.string(),
    timeZone: z.string().optional(),
});

const ScheduleOverrideSchema = z.object({
    name: z.string(),
    type: z.enum(['add', 'remove']),
    fromDate: DateClassSchema,
    toDate: DateClassSchema,
    timeZone: z.string().optional(),
});

const HolidaysRestAndLeaveAppliedEntrySchema = z.object({
    applicableFromDate: z.string().optional(),
    applicableToDate: z.string().optional(),
    timeZone: z.string().optional(),
    holidaysRestAndLeaveEntryKey: z.string(),
});

const TimingScheduleSchema = z.object({
    key: z.string(),
    timeZone: z.string(),
    defaultSleepTime: DefaultSleepTimeSchema.optional(),
    onCallExceptions: z.array(OnCallExceptionSchema).optional(),
    overrides: z.array(ScheduleOverrideSchema).optional(),
    weeklyScheduleApplicable: z.array(WeeklyScheduleApplicableSchema).optional(),
    monthlyScheduleApplicable: z.array(MonthlyScheduleApplicableSchema).optional(),
    yearlyScheduleApplicable: z.array(YearlyScheduleApplicableSchema).optional(),
    timeSlices: z.array(TimeSliceSchema).optional(),
    holidaysRestAndLeaveApplied: z.array(HolidaysRestAndLeaveAppliedEntrySchema).optional(),
});

// ---- Work Hours Ratio Types ----
const WorkHoursRatioItemSchema = z.object({
    ratioValue: z.number(),
    startDate: DateClassSchema,
    endDate: DateClassSchema,
});

const WorkHoursRatioSchema = z.union([
    z.number(),
    z.array(WorkHoursRatioItemSchema),
]);

const WorkHoursRatioNullableSchema = z.union([WorkHoursRatioSchema, z.null()]);

// ---- Project-related Types ----
const ProjectDateTimeRangeEntrySchema = z.object({
    startDate: z.string(),
    endDate: z.string().optional(),
    timeZone: z.string().optional(),
});

const ProjectDateTimeRangeEntryPartialSchema = ProjectDateTimeRangeEntrySchema.partial();

const ProjectBreakSchema = z.object({
    fromDate: DateClassSchema,
    toDate: DateClassSchema,
    timeZone: z.string().optional(),
});

const OrganizationLocationKeySchema = z.object({
    organizationLocationKey: z.string(),
    workModelsKeysRatios: z.record(z.string(), WorkHoursRatioSchema),
    workHoursRatio: WorkHoursRatioNullableSchema.optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

const OrganizationsKeySchema = z.object({
    organizationKey: z.string(),
    organizationLocationsKeys: z.array(OrganizationLocationKeySchema).nonempty(), // [T, ...T[]]
    workHoursRatio: WorkHoursRatioNullableSchema.optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

const ConceptKeySchema = z.object({
    key: z.string(),
    workHoursRatio: WorkHoursRatioSchema,
    organizationsKeys: z.array(OrganizationsKeySchema).optional(),
});

const ProjectActionTagKeySchema = z.object({
    key: z.string(),
    workHoursRatio: WorkHoursRatioSchema,
    organizationsKeys: z.array(OrganizationsKeySchema).optional(),
});

// Recursive: ProjectSubAction (partial of ProjectAction)
const ProjectSubActionSchema = z.object({
    name: z.string(),
    workHoursRatio: WorkHoursRatioSchema,
    projectActionsTagsKeys: z.array(ProjectActionTagKeySchema).optional(),
    timingScheduleTimeSlice: z.string().optional(),
    organizationsKeys: z.array(OrganizationsKeySchema).optional(),
    conceptsKeys: z.array(ConceptKeySchema).optional(),
    subActions: z.lazy((): z.ZodType<any> => z.array(ProjectSubActionSchema)).optional(),
    technologyLogs: z.lazy((): z.ZodType<any> => z.array(TechnologyLogSchema)).optional()
});

// HoursEntry schemas
const HoursEntryWithoutAreHoursPerBasisAdditionalSchema = z.object({
    periodStartDate: z.string(),
    periodEndDate: z.string(),
    timeZone: z.string().optional(),
    timingScheduleTimeSliceKey: z.string().optional(),
    hoursTimeBasisEvery: z.enum(['definite', 'day', 'week', 'month', 'year']).optional(),
    hoursTimeBasisEveryMultiplier: z.number().optional(),
    hoursPerBasis: z.number(),
});

const HoursEntrySchema = HoursEntryWithoutAreHoursPerBasisAdditionalSchema.extend({
    areHoursPerBasisAdditional: z.boolean().optional(),
});

// TechnologyLog (recursive)
const TechnologyLogSchema = z.object({
    technologyKey: z.string(),
    description: z.string().optional(),
    timeZone: z.string().optional(),
    hoursEntries: z.array(HoursEntrySchema),
    conceptsKeys: z.array(ConceptKeySchema).optional(),
    subTechnologiesLogs: z.lazy((): z.ZodType<any> => z.array(TechnologyLogSchema)).optional(),
});

// ProjectAction (recursive)
const ProjectActionSchema = z.object({
    name: z.string(),
    projectActionsTagsKeys: z.array(ProjectActionTagKeySchema).optional(),
    timingScheduleTimeSlice: z.string().optional(),
    workHoursRatio: WorkHoursRatioSchema,
    organizationsKeys: z.array(OrganizationsKeySchema).optional(),
    conceptsKeys: z.array(ConceptKeySchema).optional(),
    subActions: z.array(ProjectSubActionSchema).optional(),
    technologyLogs: z.array(TechnologyLogSchema).optional(),
});

// SubProject (partial of Project, with special dates)
const SubProjectSchema: z.ZodType<any> = z.object({
    key: z.string(),
    name: z.string(),
    description: z.string().optional(),
    linkUrl: z.string().optional(),
    linkUrlOrganizationKey: z.string().optional(),
    dates: z
        .array(ProjectDateTimeRangeEntryPartialSchema)
        .nonempty()
        .optional(),
    timeZone: z.string().optional(),
    breaks: z.array(ProjectBreakSchema).optional(),
    timingScheduleKey: z.string().optional(),
    hoursEntries: z.array(HoursEntryWithoutAreHoursPerBasisAdditionalSchema).optional(),
    workHoursRatio: WorkHoursRatioSchema.optional(),
    organizationsKeys: z.array(OrganizationsKeySchema).optional(),
    projectActions: z.array(ProjectActionSchema).optional(),
    projectMotiveKey: z.string().optional(),
    projectTagsKeys: z.array(z.string()).optional(),
    sectorsKeysRatios: z.record(z.string(), z.number()).optional(),
    subProjects: z.lazy(() => z.array(SubProjectSchema)).optional(),
});

// Project
const ProjectSchema = z.object({
    key: z.string(),
    name: z.string(),
    description: z.string().optional(),
    linkUrl: z.string().optional(),
    linkUrlOrganizationKey: z.string().optional(),
    dates: z.array(ProjectDateTimeRangeEntrySchema).nonempty(), // [T, ...T[]]
    timeZone: z.string(),
    breaks: z.array(ProjectBreakSchema).optional(),
    timingScheduleKey: z.string(),
    hoursEntries: z.array(HoursEntryWithoutAreHoursPerBasisAdditionalSchema).optional(),
    workHoursRatio: WorkHoursRatioSchema.optional(),
    organizationsKeys: z.array(OrganizationsKeySchema),
    projectActions: z.array(ProjectActionSchema).optional(),
    projectMotiveKey: z.string(),
    projectTagsKeys: z.array(z.string()),
    sectorsKeysRatios: z.record(z.string(), z.number()).optional(),
    subProjects: z.array(SubProjectSchema).optional(),
});

// Technology
const TechnologySchema = z.object({
    key: z.string(),
    name: z.string(),
    nameLong: z.string(),
    description: z.string(),
    url: z.string(),
    logoUrl: z.string(),
    logoBackgroundColor: z.string().optional(),
    isChildOf: z.array(z.string()),
    isRelatedTo: z.array(z.string()),
    technologyTypeId: z.string(),
    roleIds: z.array(z.string()),
    corporateDependency: z.boolean(),
    vendors: z.array(z.string()),
    discontinued: z.boolean(),
    openSource: z.boolean(),
});

// Experience
const ExperienceSchema = z.object({
    experienceGradeLevels: z.array(ExperienceGradeLevelSchema),
    workModels: z.array(WorkModelSchema),
    roles: z.array(RoleSchema),
    projectMotives: z.array(ProjectMotiveSchema),
    organizations: z.array(OrganizationSchema),
    locations: z.array(LocationSchema),
    sectors: z.array(SectorSchema),
    concepts: z.array(ConceptSchema),
    technologyTypes: z.array(TechnologyTypeSchema),
    technologies: z.array(TechnologySchema),
    projects: z.array(ProjectSchema),
    timingSchedules: z.array(TimingScheduleSchema),
    holidaysRestAndLeaveEntries: z.array(HolidaysRestAndLeaveEntrySchema),
    projectTags: z.array(ProjectTagSchema),
    projectActionTags: z.array(ProjectActionTagSchema),
    companyTypes: z.array(z.string()),
});

// Content
const ContentSchema = z.object({
    profile: ProfileSchema,
    statements: z.array(InfoCardSchema),
    utilityFunctions: z.union([CustomFunctionsWithContextSchema, z.undefined()]),
    keyFunctions: z.union([FunctionContextOnlySchema, z.undefined()]),
    experience: ExperienceSchema,
    otherInterestsWants: z.array(z.string()),
    process: ProcessSchema,
    projectManagement: z.array(InfoCardSchema),
});

// SiteData
export const SiteDataSchema = z.object({
    name: z.string(),
    version: z.literal('1.0.0'),
    lastUpdated: z.string().optional(),
    description: z.string(),
    author: z.string(),
    license: z.string(),
    contactEmail: z.string(),
    socialLinks: z.array(SocialLinkSchema),
    content: ContentSchema,
});
